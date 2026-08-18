/**
 * Price slabs are quantity brackets that replace the base price outright —
 * the last slab may leave maxQty null, meaning "and up". Option values then
 * adjust whatever that resolved to: the multiplier scales it, the delta is a
 * flat add-on, applied in that order.
 */

export const slabForQty = (priceSlabs = [], qty = 1) =>
  priceSlabs.find(
    (slab) =>
      qty >= slab.minQty && (slab.maxQty == null || qty <= slab.maxQty)
  ) || null;

export const unitPriceFor = ({
  basePrice = 0,
  priceSlabs = [],
  selectedValues = [],
  qty = 1,
}) => {
  const slab = slabForQty(priceSlabs, qty);

  return selectedValues.reduce(
    (price, value) =>
      price * (value?.priceMultiplier ?? 1) + (value?.priceDelta ?? 0),
    slab ? slab.unitPrice : basePrice
  );
};

/** "₹1,290" — matches formatPrice in the demo catalogue. */
export const formatMoney = (value) =>
  `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;
