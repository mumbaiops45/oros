"use client";

import Link from "next/link";
import { listMyOrders } from "@/api/order.api";
import { useApi } from "@/hooks/useApi";
import { formatMoney } from "@/lib/pricing";
import { PRODUCTS_HREF } from "@/lib/adapters";
import { BoxesIcon, TruckIcon } from "@/components/Icons";

/** Mirrors the order model's status enum. */
const STATUS_TONES = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 ring-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PROCESSING: "bg-sky-50 text-sky-700 ring-sky-200",
  IN_PRODUCTION: "bg-sky-50 text-sky-700 ring-sky-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 ring-rose-200",
};

const label = (status) => String(status || "").replace(/_/g, " ").toLowerCase();

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

function OrderCard({ order }) {
  const items = order.items || [];
  const pricing = order.pricing || {};

  return (
    <li className="overflow-hidden rounded-3xl border border-navy/10 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 px-5 py-4">
        <div>
          {/* Mongo's id is the only order number the API has today. */}
          <p className="font-mono text-xs text-navy/50">
            #{String(order._id).slice(-8).toUpperCase()}
          </p>
          <p className="mt-0.5 text-xs text-navy/60">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize ring-1 ring-inset ${
            STATUS_TONES[order.status] || "bg-slate-100 text-slate-600 ring-slate-200"
          }`}
        >
          {label(order.status)}
        </span>
      </header>

      <ul className="divide-y divide-navy/10">
        {items.map((item) => (
          <li key={item._id} className="flex items-center gap-4 px-5 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BoxesIcon className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {item.nameSnapshot}
              </p>
              <p className="mt-0.5 text-xs text-navy/55">
                {item.skuSnapshot} · {formatMoney(item.unitPrice)} × {item.qty}
                {item.selectedOptions?.length > 0 && (
                  <>
                    {" · "}
                    {item.selectedOptions
                      .map((option) => `${option.name}: ${option.value}`)
                      .join(", ")}
                  </>
                )}
              </p>
            </div>

            <p className="shrink-0 text-sm font-semibold text-ink">
              {formatMoney(item.lineTotal)}
            </p>
          </li>
        ))}
      </ul>

      <footer className="flex flex-wrap items-end justify-between gap-4 border-t border-navy/10 bg-cream px-5 py-4">
        <div className="text-xs text-navy/60">
          {order.shipping?.courierName && (
            <p className="flex items-center gap-1.5">
              <TruckIcon className="h-3.5 w-3.5 text-primary" />
              {order.shipping.courierName} to {order.shipping.deliveryPincode}
            </p>
          )}
          <p className="mt-1">
            Subtotal {formatMoney(pricing.subtotal)} · Shipping{" "}
            {formatMoney(pricing.shipping)}
            {pricing.tax > 0 && <> · Tax {formatMoney(pricing.tax)}</>}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-navy/60">Total</p>
          <p className="font-display text-xl font-semibold text-ink">
            {formatMoney(pricing.total)}
          </p>
        </div>
      </footer>
    </li>
  );
}

/** Every order this customer has placed, newest first. */
export default function OrdersPanel() {
  const { data, error, loading } = useApi(() => listMyOrders(), []);

  // The API answers with the array itself — an empty one when there are none.
  const orders = Array.isArray(data) ? data : [];

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((row) => (
          <div key={row} className="h-40 animate-pulse rounded-3xl bg-white" />
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

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-navy/20 bg-white px-6 py-12 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <TruckIcon className="h-5 w-5" />
        </span>
        <p className="mt-4 text-sm font-semibold text-ink">No orders yet</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-navy/65">
          Every order you place shows up here with its status, courier and
          delivery details.
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
    <ul className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </ul>
  );
}
