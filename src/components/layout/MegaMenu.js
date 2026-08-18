"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatMoq } from "@/data/catalog";
import { useSubcategoryProducts } from "@/hooks/useCatalog";
import {
  categoryHref,
  productHref,
  subcategoryHref,
  toCardProduct,
  toDemoCardProduct,
} from "@/lib/adapters";
import { ArrowRightIcon, BoxesIcon, ChevronRightIcon } from "@/components/Icons";

// Category tints are a presentation choice, not catalogue data, so they are
// assigned by position rather than stored on the record.
const TONES = [
  "bg-sky-50",
  "bg-emerald-50",
  "bg-amber-50",
  "bg-violet-50",
  "bg-rose-50",
  "bg-cream",
];

/** Pane 3 for a subcategory that came from the API — products are fetched. */
function LiveProducts({ subcategoryId, tone, onNavigate }) {
  const { products, loading } = useSubcategoryProducts(subcategoryId);

  if (loading) {
    return (
      <ul className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((index) => (
          <li
            key={index}
            className="h-44 animate-pulse rounded-2xl border border-navy/10 bg-cream"
          />
        ))}
      </ul>
    );
  }

  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-navy/15 px-4 py-10 text-center text-sm text-navy/55">
        No published products in this subcategory yet.
      </p>
    );
  }

  return (
    <ProductGrid
      products={products.map(toCardProduct)}
      tone={tone}
      onNavigate={onNavigate}
    />
  );
}

function ProductGrid({ products, tone, onNavigate }) {
  return (
    <ul className="grid grid-cols-4 gap-3">
      {products.map((product) => (
        <li key={product.id || product.name}>
          <Link
            href={productHref(product)}
            onClick={onNavigate}
            className="group block rounded-2xl border border-navy/10 p-3 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className={`mb-3 flex h-28 items-center justify-center rounded-xl ${tone}`}>
              <Image
                src={product.image}
                alt={product.imageAlt || product.name}
                width={110}
                height={110}
                className="h-24 w-auto object-contain transition duration-300 group-hover:scale-110"
              />
            </div>
            <p className="line-clamp-2 text-center text-[13px] leading-snug font-medium text-navy group-hover:text-primary">
              {product.name}
            </p>
            <p className="mt-1.5 text-center text-[10px] font-semibold tracking-wide text-navy/50 uppercase">
              {product.custom ? "Custom · " : ""}Min {formatMoq(product.moq ?? 1)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Three-pane category menu.
 * pane 1: categories → pane 2: subcategories of the hovered category →
 * pane 3: fills the remaining width with product cards.
 *
 * Categories arrive already nested. A subcategory carries either its own
 * `products` array (the static demo catalogue) or an `id` the API can be
 * asked for — pane 3 handles both.
 */
export default function MegaMenu({ categories, onNavigate }) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);

  const activeCategory = categories[categoryIndex] ?? categories[0];
  const subcategories = activeCategory?.subcategories ?? [];
  const activeSub = subcategories[subIndex] ?? subcategories[0];
  const tone = TONES[categoryIndex % TONES.length];

  if (!activeCategory) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-[0_28px_70px_-25px_rgba(32,57,74,0.35)]">
      <div className="grid grid-cols-[210px_210px_1fr]">
        {/* Pane 1 — categories */}
        <ul className="border-r border-navy/10 bg-cream p-3">
          {categories.map((category, i) => {
            const active = i === categoryIndex;
            return (
              <li key={category.id || category.slug}>
                <Link
                  href={categoryHref(category)}
                  onMouseEnter={() => {
                    setCategoryIndex(i);
                    setSubIndex(0);
                  }}
                  onFocus={() => {
                    setCategoryIndex(i);
                    setSubIndex(0);
                  }}
                  onClick={onNavigate}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-white font-semibold text-primary shadow-sm"
                      : "text-navy/80 hover:bg-white hover:text-ink"
                  }`}
                >
                  <span>{category.name}</span>
                  <ChevronRightIcon
                    className={`h-4 w-4 shrink-0 transition ${
                      active ? "translate-x-0.5 opacity-100" : "opacity-40"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Pane 2 — subcategories of the hovered category */}
        <ul className="border-r border-navy/10 p-3">
          <li className="px-3 pt-1 pb-2">
            <Link
              href={categoryHref(activeCategory)}
              onClick={onNavigate}
              className="text-[10px] font-semibold tracking-[0.18em] text-navy/50 uppercase transition hover:text-primary"
            >
              All {activeCategory.name}
            </Link>
          </li>
          {subcategories.length === 0 && (
            <li className="px-3 py-2 text-[13px] text-navy/50">
              No subcategories yet
            </li>
          )}
          {subcategories.map((sub, i) => {
            const active = i === subIndex;
            return (
              <li key={sub.id || sub.slug}>
                <Link
                  href={subcategoryHref(activeCategory, sub)}
                  onMouseEnter={() => setSubIndex(i)}
                  onFocus={() => setSubIndex(i)}
                  onClick={onNavigate}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-navy/80 hover:bg-cream hover:text-ink"
                  }`}
                >
                  <span>{sub.name}</span>
                  <ChevronRightIcon
                    className={`h-4 w-4 shrink-0 transition ${active ? "opacity-100" : "opacity-0"}`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Pane 3 — products of the hovered subcategory */}
        <div className="p-5">
          {activeSub && (
            <>
              <div className="mb-4 flex items-end justify-between">
                <Link
                  href={subcategoryHref(activeCategory, activeSub)}
                  onClick={onNavigate}
                  className="font-display text-lg font-semibold text-ink transition hover:text-primary"
                >
                  {activeSub.name}
                </Link>
                <Link
                  href={subcategoryHref(activeCategory, activeSub)}
                  onClick={onNavigate}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View all {activeSub.name.toLowerCase()}
                </Link>
              </div>

              {activeSub.products ? (
                <ProductGrid
                  products={activeSub.products.map((product) =>
                    toDemoCardProduct(product, {
                      category: activeCategory.name,
                      subcategory: activeSub.name,
                    })
                  )}
                  tone={tone}
                  onNavigate={onNavigate}
                />
              ) : (
                <LiveProducts
                  subcategoryId={activeSub.id}
                  tone={tone}
                  onNavigate={onNavigate}
                />
              )}
            </>
          )}

          {/* Bulk / MOQ shortcut — the same entry point as the navbar button */}
          <a
            href="#custom"
            className="group mt-4 flex items-center justify-between gap-3 rounded-2xl bg-primary/10 px-4 py-3 transition hover:bg-primary/15"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                <BoxesIcon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-ink">
                  Need it in bulk or made to your design?
                </span>
                <span className="block text-[11px] text-navy/65">
                  Minimum order quantity starts at 10 units — up to 35% off
                </span>
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
              Get a quote
              <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
