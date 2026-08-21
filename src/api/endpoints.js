/**
 * Every path the API exposes, in one place. Mirrors src/routes/*.route.js in
 * oros_backend — if a route moves there, this is the only file that changes.
 */

export const AUTH = {
  register: "/auth/register",
  registerVerify: "/auth/register/otp-verify",
  login: "/auth/login",
  loginVerify: "/auth/login/otp-verify",
  adminLogin: "/auth/admin/login",
  me: "/auth/me",
};

export const CATEGORY = {
  list: "/category",
  create: "/category",
  update: (id) => `/category/${id}`,
  remove: (id) => `/category/${id}`,
};

export const SUBCATEGORY = {
  list: "/subCategory",
  create: "/subCategory",
  update: (id) => `/subCategory/${id}`,
  remove: (id) => `/subCategory/${id}`,
};

export const PRODUCT = {
  list: "/product",
  detail: (id) => `/product/${id}`,
  create: "/product",
  update: (id) => `/product/${id}`,
  remove: (id) => `/product/${id}`,

  specs: (productId) => `/product/${productId}/specs`,
  spec: (productId, specId) => `/product/${productId}/specs/${specId}`,

  options: (productId) => `/product/${productId}/options`,
  option: (productId, optionId) => `/product/${productId}/options/${optionId}`,

  // values hang off the option, not the product
  optionValues: (optionId) => `/product/options/${optionId}/values`,
  optionValue: (optionId, valueId) =>
    `/product/options/${optionId}/values/${valueId}`,

  priceSlabs: (productId) => `/product/${productId}/price-slabs`,
  priceSlab: (productId, slabId) =>
    `/product/${productId}/price-slabs/${slabId}`,

  // weight + box dimensions, keyed by product. The API scopes create/list by
  // a ?productId query rather than a nested path, and edits/deletes by the
  // shipping row's own id.
  shipping: "/product/shipping",
  shippingItem: (id) => `/product/shipping/${id}`,

  media: (productId) => `/product/${productId}/media`,
  mediaItem: (productId, mediaId) =>
    `/product/${productId}/media/${mediaId}`,
};

export const BULK = {
  template: "/product/bulk-template",
  import: "/product/bulk-import",
  media: "/product/bulk-media",
};

export const CART = {
  list: "/cart",
  add: "/cart",
  update: (id) => `/cart/${id}`,
  remove: (id) => `/cart/${id}`,
  // must stay above /cart/:id on the server, hence its own literal path
  clear: "/cart/clear",
};

export const ADDRESS = {
  // one address per customer, so every verb targets the same collection path
  get: "/address",
  save: "/address",
  update: "/address",
  remove: "/address",
};

export const SHIPPING_PACKAGE = {
  list: "/shipping-package",
  detail: (id) => `/shipping-package/${id}`,
  create: "/shipping-package",
  update: (id) => `/shipping-package/${id}`,
  remove: (id) => `/shipping-package/${id}`,
};

export const SHIPPING = {
  // packs the signed-in customer's cart into boxes and echoes the addresses
  prepare: "/shipping/prepare",
  // packs the cart again server-side, then quotes couriers against it
  rates: "/shipping/rates",
};
