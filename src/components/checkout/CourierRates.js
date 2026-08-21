"use client";

import { formatMoney } from "@/lib/pricing";

/** Shiprocket gives the ETD as free text on some couriers, days on others. */
const formatEta = (courier) => {
  if (!courier.estimatedDays) return null;

  const days = Number(courier.estimatedDays);

  return Number.isFinite(days)
    ? `${days} ${days === 1 ? "day" : "days"}`
    : String(courier.estimatedDays);
};

/**
 * The couriers quoted for this shipment, as one compact line each — name on
 * the left, delivery time and cost on the right — so a long list of quotes
 * still fits the summary column.
 */
export default function CourierRates({ rates, loading, error, selected, onSelect }) {
  if (loading) {
    return (
      <div className="divide-y divide-navy/10 overflow-hidden rounded-2xl border border-navy/10 bg-white">
        {[0, 1, 2].map((row) => (
          <div key={row} className="h-10 animate-pulse bg-cream/60" />
        ))}
      </div>
    );
  }

  // A quote failing does not invalidate the shipment — the boxes are still
  // right, so this degrades to a note rather than an empty panel.
  if (error) {
    return (
      <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
        {error}
      </p>
    );
  }

  if (rates.length === 0) return null;

  return (
    <ul className="divide-y divide-navy/10 overflow-hidden rounded-2xl border border-navy/10 bg-white">
      {rates.map((courier) => {
        const active = selected?.courierId === courier.courierId;
        const eta = formatEta(courier);

        return (
          <li key={courier.courierId}>
            <button
              type="button"
              onClick={() => onSelect(courier)}
              aria-pressed={active}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                active ? "bg-primary/5" : "hover:bg-cream"
              }`}
            >
              {/* A radio in looks, a button in behaviour — `aria-pressed`
                  above is what actually announces the state. */}
              <span
                aria-hidden="true"
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  active ? "border-primary" : "border-navy/25"
                }`}
              >
                {active && <span className="h-2 w-2 rounded-full bg-primary" />}
              </span>

              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                {courier.courierName}
              </span>

              <span className="shrink-0 text-xs text-navy/55">{eta || "—"}</span>

              <span className="w-16 shrink-0 text-right text-sm font-bold text-ink">
                {formatMoney(courier.totalCharge)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
