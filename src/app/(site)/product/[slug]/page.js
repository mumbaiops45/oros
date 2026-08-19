"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProductBySlug } from "@/hooks/useProduct";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { PRODUCTS_HREF, categoryHref, subcategoryHref } from "@/lib/adapters";
import { formatMoney, slabForQty, unitPriceFor } from "@/lib/pricing";
import ProductGallery from "@/components/product/ProductGallery";
import ProductOptions from "@/components/product/ProductOptions";
import ProductSlabs from "@/components/product/ProductSlabs";
import ProductSpecs from "@/components/product/ProductSpecs";
import QuantityStepper from "@/components/product/QuantityStepper";
import BulkOrderDialog from "@/components/product/BulkOrderDialog";
import { BagIcon, BoxesIcon, ClockIcon, TruckIcon } from "@/components/Icons";

export default function ProductPage({ params }) {
  // route params arrive as a promise
  const { slug } = use(params);

  const { product, specs, media, options, priceSlabs, loading, error } =
    useProductBySlug(slug);

  const router = useRouter();
  const { user } = useAuth();
  const { add: addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [selection, setSelection] = useState({});
  const [bulkOpen, setBulkOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [cartNotice, setCartNotice] = useState(null);

  const minQty = product?.minQty ?? 1;
  const quantity = Math.max(qty, minQty);

  // Only stored values carry a price; TEXT and FILE answers are free-form.
  const selectedValues = useMemo(
    () =>
      options
        .flatMap((option) => option.values || [])
        .filter((value) => Object.values(selection).includes(value._id)),
    [options, selection]
  );

  const missingRequired = options.filter(
    (option) => option.isRequired && !selection[option._id]
  );

  /**
   * The cart stores an option as a { name, value } pair, not the ids the
   * picker works in — the server hashes that pair list into the variantKey
   * that decides whether this is a new line or a top-up of an existing one.
   */
  const asCartOptions = () =>
    options
      .filter((option) => selection[option._id] !== undefined && selection[option._id] !== "")
      .map((option) => {
        const chosen = selection[option._id];
        const stored = (option.values || []).find((value) => value._id === chosen);

        return { name: option.name, value: stored ? stored.value : String(chosen) };
      });

  const onAddToCart = async () => {
    if (!user) {
      router.push(`/login?next=/product/${slug}`);
      return;
    }

    if (missingRequired.length > 0) {
      setCartNotice({
        tone: "error",
        text: `Choose ${missingRequired.map((option) => option.name).join(", ")} first.`,
      });
      return;
    }

    setAdding(true);
    setCartNotice(null);

    try {
      await addToCart({
        product: product._id,
        qty: quantity,
        selectedOptions: asCartOptions(),
      });

      setCartNotice({
        tone: "success",
        text: `${quantity} × ${product.name} added to your cart.`,
      });
    } catch (error) {
      setCartNotice({ tone: "error", text: error.message });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 pt-32 pb-20 sm:px-8 lg:px-15 lg:pt-36">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-cream" />
          <div className="space-y-4">
            <div className="h-4 w-32 animate-pulse rounded-full bg-cream" />
            <div className="h-10 w-3/4 animate-pulse rounded-xl bg-cream" />
            <div className="h-24 animate-pulse rounded-xl bg-cream" />
            <div className="h-12 w-1/2 animate-pulse rounded-full bg-cream" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-xl px-5 pt-40 pb-28 text-center sm:px-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
          Not found
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
          We couldn&apos;t find that print
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-navy/75">
          {error || "This product may have been unpublished or renamed."}
        </p>
        <Link
          href={PRODUCTS_HREF}
          className="mt-7 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          Back to the shop
        </Link>
      </div>
    );
  }

  const unit = unitPriceFor({
    basePrice: product.basePrice,
    priceSlabs,
    selectedValues,
    qty: quantity,
  });

  const tier = slabForQty(priceSlabs, quantity);
  const saving = product.basePrice > 0 ? 1 - unit / product.basePrice : 0;

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 pt-32 pb-20 sm:px-8 lg:px-15 lg:pt-36">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap items-center gap-2 text-xs text-navy/55"
        >
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          {product.category?.slug && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                href={categoryHref(product.category)}
                className="transition hover:text-primary"
              >
                {product.category.name}
              </Link>
            </>
          )}
          {product.category?.slug && product.subcategory?.slug && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                href={subcategoryHref(product.category, product.subcategory)}
                className="transition hover:text-primary"
              >
                {product.subcategory.name}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-navy/80">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery media={media} name={product.name} />

          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
              {product.category?.name}
            </p>
            <h1 className="mt-3 font-display text-3xl leading-tight font-semibold text-ink sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 font-mono text-xs text-navy/45">{product.sku}</p>

            {product.shortDescription && (
              <p className="mt-4 text-sm leading-relaxed text-navy/80">
                {product.shortDescription}
              </p>
            )}

            {/* Price reflects the quantity tier and every option chosen */}
            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="font-display text-3xl font-semibold text-ink">
                {formatMoney(unit)}
              </span>
              <span className="pb-1 text-xs text-navy/55">per unit</span>
              {saving > 0.001 && (
                <span className="mb-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  {Math.round(saving * 100)}% off at {quantity} pcs
                </span>
              )}
            </div>

            <ul className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold">
              <li className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary">
                <BoxesIcon className="h-3.5 w-3.5" />
                MOQ {minQty} {minQty === 1 ? "pc" : "pcs"}
              </li>
              <li className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-navy/70">
                <ClockIcon className="h-3.5 w-3.5" />
                Ships in {product.leadTimeDays} days
              </li>
              {product.isCustomisable && (
                <li className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-white">
                  Customisable
                </li>
              )}
            </ul>

            {options.length > 0 && (
              <div className="mt-8 border-t border-navy/10 pt-8">
                <ProductOptions
                  options={options}
                  selection={selection}
                  onSelect={(optionId, value) =>
                    setSelection((current) => ({ ...current, [optionId]: value }))
                  }
                />
              </div>
            )}

            <div className="mt-8 border-t border-navy/10 pt-8">
              <div className="flex flex-wrap items-center gap-4">
                <QuantityStepper qty={quantity} min={minQty} onChange={setQty} />
                <p className="text-sm text-navy/70">
                  Total{" "}
                  <span className="font-display text-lg font-semibold text-ink">
                    {formatMoney(unit * quantity)}
                  </span>
                  {tier && (
                    <span className="ml-2 text-xs text-navy/50">
                      ({tier.minQty}
                      {tier.maxQty ? `–${tier.maxQty}` : "+"} tier)
                    </span>
                  )}
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onAddToCart}
                  disabled={adding}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-20px_rgba(97,150,170,1)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {adding ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <BagIcon className="h-4 w-4" />
                  )}
                  {adding ? "Adding…" : user ? "Add to cart" : "Sign in to add"}
                </button>

                <button
                  type="button"
                  onClick={() => setBulkOpen(true)}
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-4 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  <BoxesIcon className="h-4 w-4" />
                  Bulk order
                </button>
              </div>

              {missingRequired.length > 0 && (
                <p className="mt-3 text-xs text-navy/55">
                  Choose {missingRequired.map((option) => option.name).join(", ")}{" "}
                  before ordering.
                </p>
              )}

              {cartNotice && (
                <div
                  role="status"
                  className={`mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                    cartNotice.tone === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  <span>{cartNotice.text}</span>
                  {cartNotice.tone === "success" && (
                    <Link
                      href="/account?tab=cart"
                      className="font-bold underline underline-offset-2"
                    >
                      View cart
                    </Link>
                  )}
                </div>
              )}

              <p className="mt-4 flex items-center gap-2 text-xs text-navy/55">
                <TruckIcon className="h-4 w-4 text-primary" />
                Free shipping on orders above ₹999 · dispatched from Mumbai
              </p>
            </div>
          </div>
        </div>

        {(product.longDescription || specs.length > 0 || priceSlabs.length > 0) && (
          <div className="mt-16 grid gap-10 border-t border-navy/10 pt-12 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-8">
              {product.longDescription && (
                <section>
                  <h2 className="font-display text-xl font-semibold text-ink">
                    About this print
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-navy/80">
                    {product.longDescription}
                  </p>
                </section>
              )}

              {specs.length > 0 && (
                <section>
                  <h2 className="mb-3 font-display text-xl font-semibold text-ink">
                    Specifications
                  </h2>
                  <ProductSpecs specs={specs} />
                </section>
              )}
            </div>

            {priceSlabs.length > 0 && (
              <section>
                <h2 className="mb-3 font-display text-xl font-semibold text-ink">
                  Bulk pricing
                </h2>
                <ProductSlabs
                  priceSlabs={priceSlabs}
                  qty={quantity}
                  basePrice={product.basePrice}
                />
                <p className="mt-3 text-xs text-navy/55">
                  Tiers apply automatically as you raise the quantity.
                </p>
              </section>
            )}
          </div>
        )}
      </div>

      {bulkOpen && (
        <BulkOrderDialog
          onClose={() => setBulkOpen(false)}
          product={product}
          priceSlabs={priceSlabs}
          selectedValues={selectedValues}
        />
      )}
    </>
  );
}
