import api, { unwrap } from "@/lib/axios";
import { CART } from "./endpoints";

/**
 * Every cart route is behind `protect`, so the bearer token the axios
 * interceptor attaches is what scopes these to the signed-in customer —
 * nothing here takes a user id.
 */

/** Returns { items } — each item carries a populated `product`. */
export const getCart = () => api.get(CART.list).then(unwrap);

/** Returns { cart } — the created line, or the existing one topped up. */
export const addToCart = (body) => api.post(CART.add, body).then(unwrap);

export const updateCartQty = (id, qty) =>
  api.patch(CART.update(id), { qty }).then(unwrap);

export const removeCartItem = (id) => api.delete(CART.remove(id)).then(unwrap);

export const clearCart = () => api.delete(CART.clear).then(unwrap);
