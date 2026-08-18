"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { contact } from "@/data/catalog";
import { formatMoney, unitPriceFor } from "@/lib/pricing";
import { CloseIcon, MailIcon, PhoneIcon } from "@/components/Icons";
import ProductSlabs from "./ProductSlabs";

/**
 * Bulk enquiry. There is no orders endpoint yet, so this quotes the price
 * from the product's own slabs and hands the customer straight to the studio
 * — the numbers are real, only the submit is not built.
 */
export default function BulkOrderDialog({
  onClose,
  product,
  priceSlabs = [],
  selectedValues = [],
}) {
  const minQty = Math.max(product?.minQty ?? 1, 10);
  const [qty, setQty] = useState(minQty);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!product) return null;

  const unit = unitPriceFor({
    basePrice: product.basePrice,
    priceSlabs,
    selectedValues,
    qty,
  });

  const subject = `Bulk order enquiry — ${product.name} (${product.sku})`;
  const body = `Hi OROS,\n\nI would like a quote for ${qty} units of ${product.name} (SKU ${product.sku}).\n\nThanks,`;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-label="Bulk order"
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 rounded-full p-2 text-navy/50 transition hover:bg-cream hover:text-ink"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
          Bulk order
        </p>
        <h2 className="mt-2 pr-8 font-display text-2xl font-semibold text-ink">
          {product.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/75">
          Tell us how many you need and we will confirm the run, the colour
          match and the delivery date.
        </p>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-[11px] font-semibold tracking-[0.12em] text-navy/60 uppercase">
            Quantity
          </span>
          <input
            type="number"
            min={minQty}
            step={1}
            value={qty}
            onChange={(event) =>
              setQty(Math.max(minQty, Number(event.target.value) || minQty))
            }
            className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
          <span className="mt-1.5 block text-xs text-navy/50">
            Bulk pricing starts at {minQty} units.
          </span>
        </label>

        <div className="mt-5 flex items-end justify-between gap-4 rounded-2xl bg-cream px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] text-navy/60 uppercase">
              Indicative total
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">
              {formatMoney(unit * qty)}
            </p>
          </div>
          <p className="text-right text-xs text-navy/60">
            {formatMoney(unit)} <br /> per unit
          </p>
        </div>

        {priceSlabs.length > 0 && (
          <div className="mt-5">
            <ProductSlabs
              priceSlabs={priceSlabs}
              qty={qty}
              basePrice={product.basePrice}
            />
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href={`${contact.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            <MailIcon className="h-4 w-4" />
            Email this quote
          </a>
          <a
            href={contact.phoneHref}
            className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-5 py-3.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            <PhoneIcon className="h-4 w-4" />
            Call the studio
          </a>
        </div>

        <p className="mt-4 text-center text-xs text-navy/50">
          Prefer to upload a design?{" "}
          <Link
            href="/#custom"
            onClick={onClose}
            className="font-semibold text-primary hover:underline"
          >
            Start a custom order
          </Link>
        </p>
      </div>
    </div>
  );
}
