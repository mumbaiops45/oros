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
