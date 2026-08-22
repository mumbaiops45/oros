import api, { unwrap } from "@/lib/axios";
import { ORDER } from "./endpoints";

/**
 * Orders are placed against a saved shipping quote rather than a price the
 * browser worked out: the API re-reads the quote it stored when the rates
 * were fetched, so all that travels is the quote and the chosen courier.
 */

/** Returns { order, items }. */
export const createOrder = ({ shippingQuoteId, shippingCourierId }) =>
  api.post(ORDER.create, { shippingQuoteId, shippingCourierId }).then(unwrap);

/** Returns the customer's orders, newest first, each with its `items`. */
export const listMyOrders = () => api.get(ORDER.mine).then(unwrap);
