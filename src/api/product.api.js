import api, { unwrap } from "@/lib/axios";
import { PRODUCT } from "./endpoints";
import { toFormData } from "./formData";

/* ------------------------------------------------------------------
   PRODUCT
------------------------------------------------------------------ */

export const listProducts = (params, config) =>
  api.get(PRODUCT.list, { params, ...config }).then(unwrap);

/** Returns { product, specs, media, options (with values), priceSlabs }. */
export const getProduct = (id) => api.get(PRODUCT.detail(id)).then(unwrap);

export const createProduct = (values) =>
  api.post(PRODUCT.create, values).then(unwrap);

export const updateProduct = (id, values) =>
  api.put(PRODUCT.update(id), values).then(unwrap);

export const deleteProduct = (id) =>
  api.delete(PRODUCT.remove(id)).then(unwrap);

/* ------------------------------------------------------------------
   SPECS
------------------------------------------------------------------ */

export const listSpecs = (productId) =>
  api.get(PRODUCT.specs(productId)).then(unwrap);

export const createSpec = (productId, values) =>
  api.post(PRODUCT.specs(productId), values).then(unwrap);

export const updateSpec = (productId, specId, values) =>
  api.put(PRODUCT.spec(productId, specId), values).then(unwrap);

export const deleteSpec = (productId, specId) =>
  api.delete(PRODUCT.spec(productId, specId)).then(unwrap);

/* ------------------------------------------------------------------
   OPTIONS + VALUES
------------------------------------------------------------------ */

export const listOptions = (productId) =>
  api.get(PRODUCT.options(productId)).then(unwrap);

export const createOption = (productId, values) =>
  api.post(PRODUCT.options(productId), values).then(unwrap);

export const updateOption = (productId, optionId, values) =>
  api.put(PRODUCT.option(productId, optionId), values).then(unwrap);

export const deleteOption = (productId, optionId) =>
  api.delete(PRODUCT.option(productId, optionId)).then(unwrap);

export const listOptionValues = (optionId) =>
  api.get(PRODUCT.optionValues(optionId)).then(unwrap);

export const createOptionValue = (optionId, values) =>
  api.post(PRODUCT.optionValues(optionId), values).then(unwrap);

export const updateOptionValue = (optionId, valueId, values) =>
  api.put(PRODUCT.optionValue(optionId, valueId), values).then(unwrap);

export const deleteOptionValue = (optionId, valueId) =>
  api.delete(PRODUCT.optionValue(optionId, valueId)).then(unwrap);

/* ------------------------------------------------------------------
   PRICE SLABS
------------------------------------------------------------------ */

export const listPriceSlabs = (productId) =>
  api.get(PRODUCT.priceSlabs(productId)).then(unwrap);

export const createPriceSlab = (productId, values) =>
  api.post(PRODUCT.priceSlabs(productId), values).then(unwrap);

export const updatePriceSlab = (productId, slabId, values) =>
  api.put(PRODUCT.priceSlab(productId, slabId), values).then(unwrap);

export const deletePriceSlab = (productId, slabId) =>
  api.delete(PRODUCT.priceSlab(productId, slabId)).then(unwrap);

/* ------------------------------------------------------------------
   MEDIA
------------------------------------------------------------------ */

export const listMedia = (productId) =>
  api.get(PRODUCT.media(productId)).then(unwrap);

export const createMedia = (productId, file, values = {}) =>
  api.post(PRODUCT.media(productId), toFormData(values, "file", file)).then(unwrap);

export const updateMedia = (productId, mediaId, values) =>
  api.put(PRODUCT.mediaItem(productId, mediaId), values).then(unwrap);

export const deleteMedia = (productId, mediaId) =>
  api.delete(PRODUCT.mediaItem(productId, mediaId)).then(unwrap);

/* ------------------------------------------------------------------
   SLUG LOOKUP

   The API addresses a product by id — GET /product/:id — but the
   storefront URL is /product/[slug], so the slug has to be resolved to
   an id first.

   Slugs are almost always the name lowercased and hyphenated, so a name
   search for the de-hyphenated slug finds it in a single request. The
   walk below is the fallback for a slug that was edited by hand, and it
   stops as soon as the API says there are no more pages.
------------------------------------------------------------------ */

const LOOKUP_PAGE_SIZE = 100;

/** @returns {Promise<string|null>} the product id, or null if no slug matches */
export const findProductIdBySlug = async (slug) => {
  const target = String(slug || "").toLowerCase();
  if (!target) return null;

  const matches = (products = []) =>
    products.find((product) => product.slug === target)?._id || null;

  const guess = await listProducts({
    search: target.replace(/-/g, " "),
    page: 1,
    limit: LOOKUP_PAGE_SIZE,
  });

  const guessed = matches(guess?.products);
  if (guessed) return guessed;

  let page = 1;

  for (;;) {
    const data = await listProducts({ page, limit: LOOKUP_PAGE_SIZE });

    const found = matches(data?.products);
    if (found) return found;

    const totalPages = data?.pagination?.totalPages ?? 1;
    if (page >= totalPages) return null;

    page += 1;
  }
};

/** Same payload as getProduct, addressed by slug. */
export const getProductBySlug = async (slug) => {
  const id = await findProductIdBySlug(slug);

  if (!id) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  return getProduct(id);
};

/**
 * Uploads a queue of files as one ordered set.
 *
 * Sequential on purpose: the API derives both the next sortOrder and the
 * "first upload becomes primary" flag from what is already stored, so
 * parallel uploads would race on each other. Sending an explicit sortOrder
 * on top of that makes the final order exactly the order shown on screen.
 *
 * @param {string} productId
 * @param {Array<{file: File, altText?: string, isPrimary?: boolean}>} items
 * @param {{startAt?: number, onProgress?: (progress: object) => void}} options
 */
export const uploadMediaQueue = async (
  productId,
  items,
  { startAt = 1, onProgress } = {}
) => {
  const uploaded = [];

  for (const [index, item] of items.entries()) {
    onProgress?.({
      done: index,
      total: items.length,
      name: item.file.name,
      uploading: true,
    });

    const data = await createMedia(productId, item.file, {
      altText: item.altText || "",
      sortOrder: startAt + index,
      isPrimary: Boolean(item.isPrimary),
    });

    uploaded.push(data?.media);

    onProgress?.({
      done: index + 1,
      total: items.length,
      name: item.file.name,
      uploading: index + 1 < items.length,
    });
  }

  return uploaded;
};

/**
 * Swaps the sortOrder of two media rows. The API has no reorder endpoint, so
 * a move is two updates — done one after the other so a failure on the second
 * cannot be masked by the first.
 */
export const swapMediaOrder = async (productId, a, b) => {
  await updateMedia(productId, a._id, { sortOrder: b.sortOrder });
  await updateMedia(productId, b._id, { sortOrder: a.sortOrder });
};

/* ------------------------------------------------------------------
   SHIPPING (weight + dimensions, one row per product)

   The API scopes these by `?productId` instead of a nested path, and a
   product may have at most one row — creating a second answers 409.
------------------------------------------------------------------ */

/** Returns { shipping } — the row, or null when the product has none. */
export const getProductShipping = async (productId) => {
  try {
    return await api
      .get(PRODUCT.shipping, { params: { productId } })
      .then(unwrap);
  } catch (error) {
    // "not set yet" is the normal state for a fresh product, not a failure
    if (error.status === 404) return { shipping: null };
    throw error;
  }
};

export const createProductShipping = (productId, values) =>
  api.post(PRODUCT.shipping, values, { params: { productId } }).then(unwrap);

export const updateProductShipping = (id, values) =>
  api.patch(PRODUCT.shippingItem(id), values).then(unwrap);

export const deleteProductShipping = (id) =>
  api.delete(PRODUCT.shippingItem(id)).then(unwrap);

/** Creates the row on first save and patches it on every save after. */
export const saveProductShipping = (productId, existingId, values) =>
  existingId
    ? updateProductShipping(existingId, values)
    : createProductShipping(productId, values);
