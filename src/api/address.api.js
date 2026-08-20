import api, { unwrap } from "@/lib/axios";
import { ADDRESS } from "./endpoints";

/**
 * A customer has exactly one address — the model puts a unique index on
 * `user` — so there is no id in any of these paths. The bearer token the
 * axios interceptor attaches is what picks the row.
 */

/** Returns { address } — `address` is null when nothing is saved yet. */
export const getAddress = () => api.get(ADDRESS.get).then(unwrap);

/** Upsert: creates the address on first save, overwrites it after that. */
export const saveAddress = (body) => api.post(ADDRESS.save, body).then(unwrap);

/** Patches the saved address — 404s if there is nothing to patch. */
export const updateAddress = (body) =>
  api.patch(ADDRESS.update, body).then(unwrap);

export const deleteAddress = () => api.delete(ADDRESS.remove).then(unwrap);
