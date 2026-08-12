"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRightIcon } from "@/components/Icons";

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
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_28px_70px_-25px_rgba(15,23,42,0.35)]">
      <div className="grid grid-cols-[210px_210px_1fr]">
        {/* Pane 1 — categories */}
        <ul className="border-r border-slate-100 bg-slate-50/70 p-3">
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
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
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
        <ul className="border-r border-slate-100 p-3">
          <li className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
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
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
            <p className="font-display text-lg font-semibold text-slate-900">{activeSub.name}</p>
            <a href="#" className="text-xs font-semibold text-primary hover:underline">
              View all {activeSub.name.toLowerCase()}
            </a>
          </div>

          <ul className="grid grid-cols-4 gap-3">
            {activeSub.products.map((product) => (
              <li key={product.name}>
                <a
                  href="#"
                  className="group block rounded-2xl border border-slate-100 p-3 transition hover:border-primary/40 hover:shadow-md"
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
                  <p className="line-clamp-2 text-center text-[13px] font-medium leading-snug text-slate-700 group-hover:text-primary">
                    {product.name}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
