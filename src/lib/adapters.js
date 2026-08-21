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
  subcategorySlug: product.subcategory?.slug || "",
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

/**
 * The static demo catalogue nests its subcategories (and their products)
 * inline and carries no ids, so it is reshaped into the same nav shape the
 * API produces. Everything downstream — header, rails, browse pages — then
 * reads one shape and never has to ask where the record came from.
 *
 * A demo subcategory keeps its `products` array; a live one carries an `id`
 * the API can be asked for instead.
 */
export const toNavDemoCategory = (category) => ({
  id: category.slug,
  name: category.name,
  slug: category.slug,
  blurb: category.blurb || "",
  image: category.image || CATEGORY_IMAGE_FALLBACK,
  demo: true,
  subcategories: (category.subcategories || []).map((sub) => ({
    id: sub.slug,
    name: sub.name,
    slug: sub.slug,
    blurb: "",
    image: sub.products?.[0]?.image || CATEGORY_IMAGE_FALLBACK,
    demo: true,
    products: sub.products || [],
  })),
});

/** A nested demo product as the shared product card wants it. */
export const toDemoCardProduct = (
  product,
  { category = "", subcategory = "" } = {}
) => ({
  id: product.slug || slugify(product.name || ""),
  name: product.name,
  slug: product.slug || slugify(product.name || ""),
  price: product.price,
  image: product.image || PRODUCT_IMAGE_FALLBACK,
  imageAlt: product.name,
  category: product.category || category,
  subcategory: product.subcategory || subcategory,
  moq: product.moq ?? 1,
  custom: Boolean(product.custom),
  // no row in Mongo behind it, so nothing can be added to a real cart
  demo: true,
  blurb: "",
  rating: product.rating,
  reviews: product.reviews,
  mrp: product.mrp,
  badge: product.badge,
  material: product.material,
});

/* ------------------------------------------------------------------
   STOREFRONT URLS

   One place decides what a catalogue record's page is, so a route rename
   is a single edit rather than a grep across every rail.
------------------------------------------------------------------ */

export const CATEGORIES_HREF = "/categories";
export const PRODUCTS_HREF = "/products";

export const categoryHref = (category) =>
  `/categories/${category?.slug || slugify(category?.name || "")}`;

export const subcategoryHref = (category, subcategory) =>
  `${categoryHref(category)}/${subcategory?.slug || slugify(subcategory?.name || "")}`;
