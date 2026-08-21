"use client";

import { BoxesIcon } from "@/components/Icons";

/**
 * The packing engine places one unit per entry — a line of 3 comes back as
 * three rows — so they are folded back into "name × qty" for display.
 */
const groupItems = (items = []) => {
  const rows = new Map();

  for (const item of items) {
    const key = String(item.product || item.name);
    const existing = rows.get(key);

    if (existing) existing.qty += item.qty || 1;
    else rows.set(key, { key, name: item.name, qty: item.qty || 1 });
  }

  return [...rows.values()];
};

function PackageCard({ pack, index }) {
  const items = groupItems(pack.items);

  return (
    <li className="rounded-2xl border border-navy/10 bg-white px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BoxesIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">
              Box {index + 1}
              {pack.packageName && (
                <span className="ml-2 font-normal text-navy/55">
                  {pack.packageName}
                </span>
              )}
            </p>
            <p className="text-xs text-navy/55">
              {pack.length} × {pack.width} × {pack.height} cm · {pack.weight} kg
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-navy/50">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-navy/10 pt-3">
          {items.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between gap-3 text-xs text-navy/70"
            >
              <span className="truncate">{item.name}</span>
              <span className="shrink-0 font-semibold text-navy/50">× {item.qty}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/** How the cart was packed — one card per box the engine filled. */
export default function ShipmentPackages({ packages = [] }) {
  if (packages.length === 0) return null;

  return (
    <ul className="space-y-3">
      {packages.map((pack, index) => (
        <PackageCard key={`${pack.boxId}-${index}`} pack={pack} index={index} />
      ))}
    </ul>
  );
}
