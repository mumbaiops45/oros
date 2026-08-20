"use client";

import { useEffect, useState } from "react";
import { prepareShipping } from "@/api/shipping.api";
import { EMPTY_ADDRESS, toAddressForm, useAddress } from "@/hooks/useAddress";
import { formatMoney } from "@/lib/pricing";
import {
  BoxesIcon,
  CheckIcon,
  CloseIcon,
  PinIcon,
  TruckIcon,
} from "@/components/Icons";

/* ------------------------------------------------------------------
   Address form
   ------------------------------------------------------------------ */

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
 * Seeded once from `initial` — the dialog only renders this after the saved
 * address has loaded, and re-keys it when that address changes, so there is
 * nothing to sync afterwards.
 */
function AddressForm({ initial, saving, onSubmit }) {
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

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={saving || incomplete}
          className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving address…" : "Save address & see shipping"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------
   Packed shipment
   ------------------------------------------------------------------ */

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

function ShipmentSummary({ shipment, total, onEditAddress }) {
  const { delivery, pickup, packages = [] } = shipment;

  return (
    <div className="space-y-5">
      <p className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
        <CheckIcon className="h-4 w-4 shrink-0" />
        Address saved — your order packs into {packages.length}{" "}
        {packages.length === 1 ? "box" : "boxes"}
      </p>

      <div className="rounded-2xl border border-navy/10 bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-navy/55 uppercase">
              <PinIcon className="h-3.5 w-3.5 text-primary" />
              Delivering to
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">{delivery.name}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-navy/70">
              {[delivery.addressLine1, delivery.addressLine2, delivery.landmark]
                .filter(Boolean)
                .join(", ")}
              <br />
              {delivery.city}, {delivery.state} {delivery.pincode}
              <br />
              {delivery.country} · {delivery.phone}
            </p>
          </div>

          <button
            type="button"
            onClick={onEditAddress}
            className="shrink-0 text-xs font-bold text-primary hover:underline"
          >
            Edit
          </button>
        </div>

        {pickup?.pincode && (
          <p className="mt-4 flex items-center gap-2 border-t border-navy/10 pt-3 text-xs text-navy/55">
            <TruckIcon className="h-3.5 w-3.5 text-primary" />
            Ships from {pickup.pincode}
          </p>
        )}
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-[0.12em] text-navy/55 uppercase">
          Your shipment
        </p>
        <ul className="space-y-3">
          {packages.map((pack, index) => (
            <PackageCard key={`${pack.boxId}-${index}`} pack={pack} index={index} />
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy/10 bg-cream px-5 py-4">
        <div>
          <p className="text-xs text-navy/60">Cart total</p>
          <p className="font-display text-xl font-semibold text-ink">
            {formatMoney(total)}
          </p>
        </div>

        {/* Payment is the next piece of the API — the address is stored and
            the shipment is worked out either way. */}
        <button
          type="button"
          disabled
          title="Payment is not live yet"
          className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-white opacity-60"
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Dialog
   ------------------------------------------------------------------ */

function Loader() {
  return (
    <div className="flex justify-center py-10">
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-navy/20 border-t-primary" />
    </div>
  );
}

/**
 * Checkout in two steps: capture the delivery address (upserted to
 * /address), then ask /shipping/prepare to pack the cart and show what
 * actually ships.
 *
 * A customer whose address is already on file skips the form and lands on
 * the shipment, with an Edit link back to it.
 */
export default function CheckoutDialog({ total, onClose }) {
  const { address, loading, save } = useAddress();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [packing, setPacking] = useState(false);
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // An address already on file goes straight to the shipment. The cart is
  // packed once per opening — CartPanel mounts this only while it is open,
  // so a cart edited between visits is re-packed on the next one.
  useEffect(() => {
    if (loading || !address || editing || shipment || packing) return undefined;

    let cancelled = false;

    const pack = async () => {
      setPacking(true);

      try {
        const data = await prepareShipping();
        if (!cancelled) setShipment(data);
      } catch (packError) {
        // the API's messages are written for the customer ('Cart is empty',
        // 'Shipping details are missing for X') — show them as they are
        if (!cancelled) {
          setError(packError.message);
          setEditing(true);
        }
      } finally {
        if (!cancelled) setPacking(false);
      }
    };

    pack();

    return () => {
      cancelled = true;
    };
  }, [loading, address, shipment, packing, editing]);

  const submit = async (values) => {
    setSaving(true);
    setError("");

    try {
      await save(values);

      const data = await prepareShipping();
      setShipment(data);
      setEditing(false);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const showForm = !loading && (editing || !address);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-ink/50 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-cream shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-navy/10 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
              Checkout
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink">
              {showForm ? "Delivery address" : "Shipping summary"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="rounded-full p-2 text-navy/40 transition hover:bg-white hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
          {error && (
            <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          )}

          {loading && <Loader />}

          {showForm && (
            <AddressForm
              key={address?._id || "new"}
              initial={address ? toAddressForm(address) : { ...EMPTY_ADDRESS }}
              saving={saving}
              onSubmit={submit}
            />
          )}

          {!loading && !showForm && (shipment ? (
            <ShipmentSummary
              shipment={shipment}
              total={total}
              onEditAddress={() => setEditing(true)}
            />
          ) : (
            <Loader />
          ))}
        </div>
      </div>
    </div>
  );
}
