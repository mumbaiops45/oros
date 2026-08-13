"use client";

import { useState } from "react";
import Image from "next/image";
import { formatMoq } from "@/data/catalog";
import { ArrowRightIcon, BoxesIcon, ChevronRightIcon } from "@/components/Icons";

/**
 * Three-pane category menu.
 * pane 1: categories → pane 2: subcategories of the hovered category →
 * pane 3: fills the remaining width with product cards (image + title only).
 */
export default function MegaMenu({ categories }) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);

  const activeCategory = categories[categoryIndex];
  const activeSub = activeCategory.subcategories[subIndex] ?? activeCategory.subcategories[0];

  return (
    <div className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-[0_28px_70px_-25px_rgba(32,57,74,0.35)]">
      <div className="grid grid-cols-[210px_210px_1fr]">
        {/* Pane 1 — categories */}
        <ul className="border-r border-navy/10 bg-cream p-3">
          {categories.map((category, i) => {
            const active = i === categoryIndex;
            return (
              <li key={category.slug}>
                <button
                  type="button"
                  onMouseEnter={() => {
                    setCategoryIndex(i);
                    setSubIndex(0);
                  }}
                  onFocus={() => {
                    setCategoryIndex(i);
                    setSubIndex(0);
                  }}
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
                </button>
              </li>
            );
          })}
        </ul>

        {/* Pane 2 — subcategories of the hovered category */}
        <ul className="border-r border-navy/10 p-3">
          <li className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/50">
            {activeCategory.name}
          </li>
          {activeCategory.subcategories.map((sub, i) => {
            const active = i === subIndex;
            return (
              <li key={sub.slug}>
                <button
                  type="button"
                  onMouseEnter={() => setSubIndex(i)}
                  onFocus={() => setSubIndex(i)}
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
                </button>
              </li>
            );
          })}
        </ul>

        {/* Pane 3 — products of the hovered subcategory */}
        <div className="p-5">
          <div className="mb-4 flex items-end justify-between">
            <p className="font-display text-lg font-semibold text-ink">{activeSub.name}</p>
            <a href="#" className="text-xs font-semibold text-primary hover:underline">
              View all {activeSub.name.toLowerCase()}
            </a>
          </div>

          <ul className="grid grid-cols-4 gap-3">
            {activeSub.products.map((product) => (
              <li key={product.name}>
                <a
                  href="#"
                  className="group block rounded-2xl border border-navy/10 p-3 transition hover:border-primary/40 hover:shadow-md"
                >
                  <div
                    className={`mb-3 flex h-28 items-center justify-center rounded-xl ${activeCategory.tone}`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={110}
                      height={110}
                      className="h-24 w-auto transition duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="line-clamp-2 text-center text-[13px] font-medium leading-snug text-navy group-hover:text-primary">
                    {product.name}
                  </p>
                  <p className="mt-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-navy/50">
                    {product.custom ? "Custom · " : ""}Min {formatMoq(product.moq ?? 1)}
                  </p>
                </a>
              </li>
            ))}
          </ul>

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
