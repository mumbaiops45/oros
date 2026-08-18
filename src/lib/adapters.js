import { slugify } from "./slug";

/**
 * The API models a catalogue; the storefront components were built against a
 * richer demo shape. These adapters bridge the two in one place so no
 * component has to know what the API does and does not store.
 *
 * Fields the API genuinely has no column for — rating, review count, MRP,
 * material, badge — come back undefined rather than invented, and every
 * component treats them as optional.
 */

export const PRODUCT_IMAGE_FALLBACK = "/products/spool.svg";
export const CATEGORY_IMAGE_FALLBACK = "/workshop-collection.svg";

/** An API product as the product cards and mega menu want it. */
export const toCardProduct = (product) => ({
  id: product._id,
  sku: product.sku,
  name: product.name,
  slug: product.slug,
  price: product.basePrice,
  image: product.primaryMedia?.url || PRODUCT_IMAGE_FALLBACK,
  imageAlt: product.primaryMedia?.altText || product.name,
  category: product.category?.name || "",
  categorySlug: product.category?.slug || "",
  subcategory: product.subcategory?.name || "",
  moq: product.minQty ?? 1,
  custom: Boolean(product.isCustomisable),
  leadTimeDays: product.leadTimeDays,
  blurb: product.shortDescription || "",
});

/** An API category as the navigation and the category rail want it. */
export const toNavCategory = (category) => ({
  id: category._id,
  name: category.name,
  slug: category.slug,
  blurb: category.description || "",
  image: category.image || CATEGORY_IMAGE_FALLBACK,
  subcategories: (category.subcategories || []).map((sub) => ({
    id: sub._id,
    name: sub.name,
    slug: sub.slug,
    blurb: sub.description || "",
    image: sub.image || CATEGORY_IMAGE_FALLBACK,
  })),
});

/**
 * The storefront still ships a static demo catalogue. Until products have
 * been loaded into Mongo the live lists come back empty, and an empty home
 * page is worse than the placeholder — so components fall back through this.
 */
export const orFallback = (live, fallback) =>
  live && live.length > 0 ? live : fallback;

/**
 * Storefront URL for a product. Live records carry their own slug; the demo
 * catalogue's nested entries do not, so one is derived from the name.
 */
export const productHref = (product) =>
  `/product/${product.slug || slugify(product.name || "")}`;
