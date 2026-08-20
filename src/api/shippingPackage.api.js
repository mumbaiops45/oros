import api, { unwrap } from "@/lib/axios";
import { SHIPPING_PACKAGE } from "./endpoints";

/**
 * The box catalogue the packing engine picks from. Admin-only, and only
 * rows with `isActive` are considered when a cart is packed.
 */

/** Returns { shippingPackages }. */
export const listShippingPackages = () =>
  api.get(SHIPPING_PACKAGE.list).then(unwrap);

export const getShippingPackage = (id) =>
  api.get(SHIPPING_PACKAGE.detail(id)).then(unwrap);

export const createShippingPackage = (values) =>
  api.post(SHIPPING_PACKAGE.create, values).then(unwrap);

export const updateShippingPackage = (id, values) =>
  api.patch(SHIPPING_PACKAGE.update(id), values).then(unwrap);

export const deleteShippingPackage = (id) =>
  api.delete(SHIPPING_PACKAGE.remove(id)).then(unwrap);
