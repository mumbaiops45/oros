"use client";

import { useState } from "react";

/** Exactly the fields the address service rejects a save without. */
const REQUIRED = ["name", "phone", "addressLine1", "city", "state", "pincode"];

const FIELDS = [
  { name: "name", label: "Full name", placeholder: "Riya Sharma" },
  { name: "phone", label: "Mobile number", placeholder: "9876543210" },
  {
    name: "addressLine1",
    label: "Address",
    placeholder: "Flat / house no., building, street",
    wide: true,
  },
  {
    name: "addressLine2",
    label: "Area (optional)",
    placeholder: "Locality, area",
    wide: true,
  },
  {
    name: "landmark",
    label: "Landmark (optional)",
    placeholder: "Near the metro station",
    wide: true,
  },
  { name: "city", label: "City", placeholder: "Mumbai" },
  { name: "state", label: "State", placeholder: "Maharashtra" },
  { name: "pincode", label: "PIN code", placeholder: "400001" },
  { name: "country", label: "Country", placeholder: "India" },
];

const CONTROL =
  "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-navy/35 focus:border-primary focus:ring-2 focus:ring-primary/20";

/**
 * Seeded once from `initial` — the page renders this only after the saved
 * address has loaded and re-keys it when that address changes, so there is
 * nothing to sync afterwards.
 */
export default function AddressForm({ initial, saving, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial);

  const set = (name) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const incomplete = REQUIRED.some((name) => !String(values[name] || "").trim());

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      {FIELDS.map((field) => (
        <label key={field.name} className={field.wide ? "sm:col-span-2" : undefined}>
          <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.12em] text-navy/55 uppercase">
            {field.label}
          </span>
          <input
            className={CONTROL}
            value={values[field.name] ?? ""}
            onChange={set(field.name)}
            placeholder={field.placeholder}
            required={REQUIRED.includes(field.name)}
            inputMode={
              field.name === "phone" || field.name === "pincode"
                ? "numeric"
                : undefined
            }
          />
        </label>
      ))}

      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={saving || incomplete}
          className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving address…" : "Save address & get rates"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-full border-2 border-navy/15 px-6 py-3 text-sm font-bold text-navy transition hover:border-navy/30 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
