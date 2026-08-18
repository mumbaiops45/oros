"use client";

import { formatMoney } from "@/lib/pricing";

/** A hex literal can be painted as a swatch; a colour name cannot. */
const asSwatch = (value) => (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value) ? value : null);

const priceNote = (value) => {
  const parts = [];

  if (value.priceMultiplier && value.priceMultiplier !== 1) {
    parts.push(`×${value.priceMultiplier}`);
  }

  if (value.priceDelta) {
    parts.push(`${value.priceDelta > 0 ? "+" : "−"}${formatMoney(Math.abs(value.priceDelta))}`);
  }

  return parts.join(" ");
};

/**
 * The four option types the API models. SELECT and COLOR are a list of
 * stored values; TEXT and FILE are whatever the customer supplies, so they
 * carry no price of their own.
 */
export default function ProductOptions({ options = [], selection, onSelect }) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const chosen = selection[option._id];

        return (
          <fieldset key={option._id}>
            <legend className="mb-2.5 flex w-full items-center justify-between gap-3">
              <span className="text-[11px] font-semibold tracking-[0.12em] text-navy/60 uppercase">
                {option.name}
                {option.isRequired && <span className="text-rose-500"> *</span>}
              </span>
              {(option.type === "SELECT" || option.type === "COLOR") && chosen && (
                <span className="text-xs font-semibold text-ink">
                  {option.values.find((value) => value._id === chosen)?.value}
                </span>
              )}
            </legend>

            {(option.type === "SELECT" || option.type === "COLOR") && (
              <div className="flex flex-wrap gap-2">
                {option.values.length === 0 && (
                  <p className="text-sm text-navy/50">No choices added yet.</p>
                )}

                {option.values.map((value) => {
                  const active = chosen === value._id;
                  const swatch = option.type === "COLOR" ? asSwatch(value.value) : null;
                  const note = priceNote(value);

                  return (
                    <button
                      key={value._id}
                      type="button"
                      onClick={() => onSelect(option._id, value._id)}
                      aria-pressed={active}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-navy/15 text-navy/80 hover:border-primary/50 hover:text-ink"
                      }`}
                    >
                      {swatch && (
                        <span
                          className="h-4 w-4 rounded-full ring-1 ring-navy/20"
                          style={{ backgroundColor: swatch }}
                        />
                      )}
                      {value.value}
                      {note && (
                        <span className="text-[11px] font-medium text-navy/50">
                          {note}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {option.type === "TEXT" && (
              <input
                type="text"
                value={chosen || ""}
                onChange={(event) => onSelect(option._id, event.target.value)}
                placeholder={`Your ${option.name.toLowerCase()}`}
                className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-navy/35 focus:border-primary focus:ring-2 focus:ring-primary/25"
              />
            )}

            {option.type === "FILE" && (
              <div>
                <input
                  type="file"
                  onChange={(event) =>
                    onSelect(option._id, event.target.files?.[0]?.name || "")
                  }
                  className="w-full rounded-xl border border-dashed border-navy/25 bg-cream px-4 py-3 text-sm text-navy/70 file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-xs file:font-bold file:text-white"
                />
                <p className="mt-1.5 text-xs text-navy/50">
                  Your file is attached to the order once checkout goes live.
                </p>
              </div>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}
