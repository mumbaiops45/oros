"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getShippingRates, prepareShipping } from "@/api/shipping.api";
import { useAddress, EMPTY_ADDRESS, toAddressForm } from "@/hooks/useAddress";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { isAdmin } from "@/lib/auth";
import { formatMoney } from "@/lib/pricing";
import { PRODUCTS_HREF } from "@/lib/adapters";
import AddressForm from "./AddressForm";
import CourierRates from "./CourierRates";
import ShipmentPackages from "./ShipmentPackages";
import { BagIcon, CheckIcon, PinIcon, TruckIcon } from "@/components/Icons";

/* ------------------------------------------------------------------
   Pieces
   ------------------------------------------------------------------ */

function Section({ step, title, description, action, children }) {
  return (
    <section className="rounded-3xl border border-navy/10 bg-white px-5 py-5 sm:px-6 sm:py-6">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {step}
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-navy/60">{description}</p>
            )}
          </div>
        </div>
        {action}
      </header>

      {children}
    </section>
  );
}

/** The saved address, once there is nothing left to type. */
function SavedAddress({ address, pickupPincode }) {
  return (
    <div className="rounded-2xl bg-cream px-5 py-4">
      <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-navy/55 uppercase">
        <PinIcon className="h-3.5 w-3.5 text-primary" />
        Delivering to
      </p>
      <p className="mt-2 text-sm font-semibold text-ink">{address.name}</p>
      <p className="mt-0.5 text-sm leading-relaxed text-navy/70">
        {[address.addressLine1, address.addressLine2, address.landmark]
          .filter(Boolean)
          .join(", ")}
        <br />
        {address.city}, {address.state} {address.pincode}
        <br />
        {address.country} · {address.phone}
      </p>

      {pickupPincode && (
        <p className="mt-3 flex items-center gap-2 border-t border-navy/10 pt-3 text-xs text-navy/55">
          <TruckIcon className="h-3.5 w-3.5 text-primary" />
          Ships from {pickupPincode}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-navy/20 border-t-primary" />
    </div>
  );
}

function Screen({ children }) {
  return (
    <div className="min-h-screen bg-cream pt-32 pb-20 lg:pt-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Page
   ------------------------------------------------------------------ */

/**
 * Checkout as a page rather than a dialog: the address is captured on the
 * left, and the moment it is saved the summary column on the right fills in
 * with the packed boxes' courier quotes for the customer to pick from.
 *
 * Nothing here trusts the browser with weights — /shipping/prepare packs the
 * cart server-side and /shipping/rates re-packs it to quote, so all this
 * sends is the address.
 */
export default function CheckoutView() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const { items, count, units, total, loading: cartLoading } = useCart();
  const { address, loading: addressLoading, save } = useAddress();

  // Checkout always opens on a blank form: the customer is telling us where
  // *this* order goes, which is not necessarily where the last one went.
  // Saving upserts, so whatever they type here becomes the stored address.
  const [editing, setEditing] = useState(true);
  const [seed, setSeed] = useState({ ...EMPTY_ADDRESS });
  const [seedKey, setSeedKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Filling the form from the stored address is one click, never automatic.
  const useSavedAddress = () => {
    setSeed(toAddressForm(address));
    setSeedKey((current) => current + 1);
  };

  const [shipment, setShipment] = useState(null);
  const [packing, setPacking] = useState(false);
  const [packError, setPackError] = useState("");

  const [rates, setRates] = useState([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState("");
  const [courier, setCourier] = useState(null);

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      router.replace("/login?next=/checkout");
      return;
    }

    // Staff carts are not a thing — the admin panel is where they belong.
    if (isAdmin(user)) router.replace("/admin");
  }, [ready, user, router]);

  // Packs the cart as soon as there is an address to pack it for. `address`
  // is a fresh object after every save, so a changed pincode re-packs.
  useEffect(() => {
    if (!address || editing) return undefined;

    let cancelled = false;

    const pack = async () => {
      setPacking(true);
      setPackError("");

      try {
        const data = await prepareShipping();
        if (!cancelled) setShipment(data);
      } catch (error) {
        // the API's messages are written for the customer ("Cart is empty",
        // "Shipping details are missing for X") — show them as they are
        if (!cancelled) {
          setShipment(null);
          setPackError(error.message);
        }
      } finally {
        if (!cancelled) setPacking(false);
      }
    };

    pack();

    return () => {
      cancelled = true;
    };
  }, [address, editing]);

  // Quotes follow the packed shipment, keyed by where it is going.
  const deliveryPincode = shipment?.delivery?.pincode;

  useEffect(() => {
    if (!deliveryPincode) return undefined;

    let cancelled = false;

    const quote = async () => {
      setRatesLoading(true);
      setRatesError("");

      try {
        const data = await getShippingRates(deliveryPincode);
        if (cancelled) return;

        // cheapest first, and preselected the way a customer expects
        const quoted = [...(data?.rates || [])].sort(
          (a, b) => a.totalCharge - b.totalCharge
        );

        setRates(quoted);
        setCourier(quoted[0] || null);
      } catch (error) {
        if (!cancelled) {
          setRates([]);
          setCourier(null);
          setRatesError(error.message);
        }
      } finally {
        if (!cancelled) setRatesLoading(false);
      }
    };

    quote();

    return () => {
      cancelled = true;
    };
  }, [deliveryPincode]);

  const submit = async (values) => {
    setSaving(true);
    setSaveError("");

    try {
      await save(values);
      setEditing(false);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!ready || !user || isAdmin(user) || cartLoading) {
    return (
      <Screen>
        <Spinner />
      </Screen>
    );
  }

  if (count === 0) {
    return (
      <Screen>
        <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-navy/20 bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BagIcon className="h-5 w-5" />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">
            Nothing to check out
          </h1>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-navy/65">
            Your cart is empty. Add a print and it shows up here ready to ship.
          </p>
          <Link
            href={PRODUCTS_HREF}
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            Browse the shop
          </Link>
        </div>
      </Screen>
    );
  }

  const showForm = !addressLoading && editing;
  const shippingCost = courier?.totalCharge || 0;

  return (
    <Screen>
      <header className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
          Checkout
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Where should this go?
        </h1>
        <p className="mt-2 text-sm text-navy/70">
          Enter the delivery address for this order — the courier options
          and their charges appear alongside it.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
        {/* -------- Left: address, then how it packs -------- */}
        <div className="space-y-6">
          <Section
            step="1"
            title="Delivery address"
            description={
              showForm
                ? "We ship across India — this is also the pincode we quote against."
                : undefined
            }
            action={
              showForm
                ? address && (
                    <button
                      type="button"
                      onClick={useSavedAddress}
                      className="text-sm font-bold text-primary hover:underline"
                    >
                      Use saved address
                    </button>
                  )
                : (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="text-sm font-bold text-primary hover:underline"
                    >
                      Change
                    </button>
                  )
            }
          >
            {saveError && (
              <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {saveError}
              </p>
            )}

            {addressLoading ? (
              <Spinner />
            ) : showForm ? (
              <AddressForm
                key={seedKey}
                initial={seed}
                saving={saving}
                onSubmit={submit}
              />
            ) : (
              <SavedAddress
                address={address}
                pickupPincode={shipment?.pickup?.pincode}
              />
            )}
          </Section>

          <Section
            step="2"
            title="How it ships"
            description="Worked out from every item's weight and dimensions"
          >
            {!address || showForm ? (
              <p className="rounded-2xl bg-cream px-5 py-4 text-sm text-navy/60">
                Enter the delivery address above and your order is packed
                into boxes here.
              </p>
            ) : packing ? (
              <Spinner />
            ) : packError ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {packError}
              </p>
            ) : (
              <>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <CheckIcon className="h-4 w-4 shrink-0" />
                  Packs into {shipment?.packages?.length || 0}{" "}
                  {shipment?.packages?.length === 1 ? "box" : "boxes"}
                </p>
                <ShipmentPackages packages={shipment?.packages} />
              </>
            )}
          </Section>
        </div>

        {/* -------- Right: the summary that fills in as they go -------- */}
        <aside className="lg:sticky lg:top-28">
          <div className="rounded-3xl border border-navy/10 bg-white px-5 py-5 sm:px-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Order summary
            </h2>
            <p className="mt-0.5 text-xs text-navy/55">
              {count} {count === 1 ? "line" : "lines"} · {units} units
            </p>

            <ul className="mt-4 space-y-2 border-t border-navy/10 pt-4">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-navy/80">
                      {item.product?.name || "Product"}
                    </span>
                    <span className="text-xs text-navy/45">× {item.qty}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-ink">
                    {formatMoney((item.unitPrice || 0) * (item.qty || 0))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-navy/10 pt-4">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-navy/55 uppercase">
                  Delivery option
                </p>
                {rates.length > 0 && (
                  <p className="text-[11px] text-navy/45">
                    {rates.length} couriers
                  </p>
                )}
              </div>

              {/* The quotes only exist once there is a packed shipment to
                  quote — until then this says so rather than sitting empty. */}
              {!deliveryPincode && !ratesLoading ? (
                <p className="rounded-2xl bg-cream px-4 py-3 text-xs leading-relaxed text-navy/60">
                  Add your delivery address to see courier options and their
                  charges.
                </p>
              ) : (
                <CourierRates
                  rates={rates}
                  loading={ratesLoading}
                  error={ratesError}
                  selected={courier}
                  onSelect={setCourier}
                />
              )}
            </div>

            <dl className="mt-5 space-y-1.5 border-t border-navy/10 pt-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-navy/65">Cart</dt>
                <dd className="font-semibold text-ink">{formatMoney(total)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="min-w-0 text-navy/65">
                  Shipping
                  {courier && (
                    <span className="ml-1.5 text-xs text-navy/45">
                      {courier.courierName}
                    </span>
                  )}
                </dt>
                <dd className="shrink-0 font-semibold text-ink">
                  {ratesLoading
                    ? "…"
                    : courier
                      ? formatMoney(shippingCost)
                      : "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-end justify-between gap-3 border-t border-navy/10 pt-4">
              <p className="text-xs text-navy/60">Total</p>
              <p className="font-display text-2xl font-semibold text-ink">
                {formatMoney(total + shippingCost)}
              </p>
            </div>

            {/* Payment is the next piece of the API — the address is stored,
                the cart is packed and the courier is picked either way. */}
            <button
              type="button"
              disabled
              title="Payment is not live yet"
              className="mt-5 w-full rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white opacity-60"
            >
              Continue to payment
            </button>

            <Link
              href="/account?tab=cart"
              className="mt-3 block text-center text-xs font-semibold text-navy/55 hover:text-primary"
            >
              Back to cart
            </Link>
          </div>
        </aside>
      </div>
    </Screen>
  );
}
