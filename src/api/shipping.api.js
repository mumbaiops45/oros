import api, { unwrap } from "@/lib/axios";
import { SHIPPING } from "./endpoints";

/**
 * Packs the signed-in customer's cart into shippable boxes.
 *
 * Returns { pickup, delivery, packages } where `packages` is what the
 * packing engine worked out from every line's weight and dimensions.
 * Fails with a 400 when the address is missing, the cart is empty, or a
 * product has no shipping row — those messages are written for the
 * customer, so showing `error.message` as-is is the right thing to do.
 */
export const prepareShipping = () => api.get(SHIPPING.prepare).then(unwrap);

/**
 * Courier quotes for the cart as packed.
 *
 * The pincode is the only thing sent — the server re-packs the cart itself
 * rather than trusting weights from the browser — and answers with
 * { pickupPincode, deliveryPincode, packages, rates }.
 */
export const getShippingRates = (deliveryPincode) =>
  api.post(SHIPPING.rates, { deliveryPincode }).then(unwrap);
