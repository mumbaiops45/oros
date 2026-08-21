"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatMoney } from "@/lib/pricing";
import { PRODUCTS_HREF } from "@/lib/adapters";
import { BagIcon, BoxesIcon, CloseIcon } from "@/components/Icons";

/** The option pairs the customer picked, rendered as one quiet line. */
function OptionLine({ selectedOptions = [] }) {
  if (selectedOptions.length === 0) return null;

  return (
    <p className="mt-1 text-xs text-navy/55">
      {selectedOptions.map((option) => `${option.name}: ${option.value}`).join(" · ")}
    </p>
  );
}

function CartRow({ item, busy, onQty, onRemove }) {
  const product = item.product;
  const minQty = product?.minQty ?? 1;
  const lineTotal = (item.unitPrice || 0) * (item.qty || 0);

  return (
    <li className="flex flex-wrap items-center gap-4 bg-white px-5 py-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <BoxesIcon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        {product?.slug ? (
          <Link
            href={`/product/${product.slug}`}
            className="truncate text-sm font-semibold text-ink transition hover:text-primary"
          >
            {product.name}
          </Link>
        ) : (
          <p className="truncate text-sm font-semibold text-navy/60">
            Product no longer available
          </p>
        )}

        <OptionLine selectedOptions={item.selectedOptions} />

        <p className="mt-1 text-xs text-navy/55">
          {formatMoney(item.unitPrice)} per unit
          {minQty > 1 && <span className="ml-2">· MOQ {minQty}</span>}
        </p>
      </div>

      {/* Quantity never drops below the product's own minimum — the API
          rejects that anyway, so the control refuses it first. */}
      <div className="inline-flex items-center rounded-full border border-navy/15">
        <button
          type="button"
          disabled={busy || item.qty <= minQty}
          onClick={() => onQty(item._id, item.qty - 1)}
          aria-label="Decrease quantity"
          className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold text-navy transition hover:text-primary disabled:cursor-not-allowed disabled:text-navy/25"
        >
          −
        </button>
        <span className="w-9 text-center text-sm font-bold text-ink">{item.qty}</span>
        <button
          type="button"
          disabled={busy}
          onClick={() => onQty(item._id, item.qty + 1)}
          aria-label="Increase quantity"
          className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold text-navy transition hover:text-primary disabled:cursor-not-allowed disabled:text-navy/25"
        >
          +
        </button>
      </div>

      <p className="w-24 text-right font-display text-base font-semibold text-ink">
        {formatMoney(lineTotal)}
      </p>

      <button
        type="button"
        disabled={busy}
        onClick={() => onRemove(item._id)}
        aria-label="Remove from cart"
        className="rounded-full p-2 text-navy/40 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </li>
  );
}

export default function CartPanel() {
  const { items, count, units, total, loading, error, setQty, remove, clear } =
    useCart();

  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");

  // Every mutation refetches the list, so one flag covers the whole panel
  // rather than tracking which row is mid-flight.
  const run = async (action) => {
    setBusy(true);
    setFailure("");

    try {
      await action();
    } catch (mutationError) {
      setFailure(mutationError.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((row) => (
          <div key={row} className="h-20 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-8 text-center text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-navy/20 bg-white px-6 py-12 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BagIcon className="h-5 w-5" />
        </span>
        <p className="mt-4 text-sm font-semibold text-ink">Your cart is empty</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-navy/65">
          Add a print from any product page and it shows up here straight away.
        </p>
        <Link
          href={PRODUCTS_HREF}
          className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div>
      {failure && (
        <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {failure}
        </p>
      )}

      <ul
        className={`grid gap-px overflow-hidden rounded-3xl border border-navy/10 bg-navy/10 transition ${
          busy ? "opacity-60" : ""
        }`}
      >
        {items.map((item) => (
          <CartRow
            key={item._id}
            item={item}
            busy={busy}
            onQty={(id, qty) => run(() => setQty(id, qty))}
            onRemove={(id) => run(() => remove(id))}
          />
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-navy/10 bg-white px-5 py-5">
        <div>
          <p className="text-xs text-navy/60">
            {count} {count === 1 ? "line" : "lines"} · {units} units
          </p>
          <p className="mt-0.5 font-display text-2xl font-semibold text-ink">
            {formatMoney(total)}
          </p>
          <p className="mt-0.5 text-xs text-navy/50">
            Taxes and shipping are added at checkout.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => run(clear)}
            className="rounded-full border-2 border-navy/15 px-6 py-3 text-sm font-bold text-navy transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
          >
            Clear cart
          </button>
          {/* Checkout is its own page — the address form and the courier
              quotes need more room than this panel has. */}
          <Link
            href="/checkout"
            className="rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
