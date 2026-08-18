"use client";

import { formatMoney, slabForQty } from "@/lib/pricing";

/** The quantity brackets the admin panel set on this product. */
export default function ProductSlabs({ priceSlabs = [], qty = 1, basePrice = 0 }) {
  if (priceSlabs.length === 0) return null;

  const active = slabForQty(priceSlabs, qty);

  return (
    <div className="overflow-hidden rounded-2xl border border-navy/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-cream">
          <tr>
            <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.12em] text-navy/60 uppercase">
              Quantity
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.12em] text-navy/60 uppercase">
              Unit price
            </th>
            <th className="px-4 py-3 text-right text-[11px] font-semibold tracking-[0.12em] text-navy/60 uppercase">
              You save
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-navy/10">
          {priceSlabs.map((slab) => {
            const isActive = active?._id === slab._id;
            const saving = basePrice > 0 ? 1 - slab.unitPrice / basePrice : 0;

            return (
              <tr
                key={slab._id}
                className={isActive ? "bg-primary/10" : "bg-white"}
              >
                <td className="px-4 py-3 font-semibold text-ink">
                  {slab.minQty}
                  {slab.maxQty ? `–${slab.maxQty}` : "+"} pcs
                  {isActive && (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                      Your tier
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-ink">
                  {formatMoney(slab.unitPrice)}
                </td>
                <td className="px-4 py-3 text-right text-navy/70">
                  {saving > 0.001 ? `${Math.round(saving * 100)}%` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
