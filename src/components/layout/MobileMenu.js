"use client";

import { useState } from "react";
import { BoxesIcon, ChevronDownIcon, CloseIcon } from "@/components/Icons";

export default function MobileMenu({ categories, open, onClose }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!open) return null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
      />
      <div className="fixed inset-x-3 top-3 z-50 max-h-[88vh] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-[0.28em] text-ink">
              OROS
            </span>
            <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.42em] text-navy/50">
              3D Studio
            </span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 text-navy/65 hover:bg-cream"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Bulk / MOQ — mirrors the navbar button on desktop */}
        <a
          href="#custom"
          onClick={onClose}
          className="mb-5 flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-white"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
            <BoxesIcon className="h-4 w-4" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">Bulk / MOQ order</span>
            <span className="block text-[11px] text-white/80">
              Custom prints from 10 units · up to 35% off
            </span>
          </span>
        </a>

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-navy/50">
          Category
        </p>

        <ul className="divide-y divide-slate-100">
          {categories.map((category, i) => {
            const expanded = openIndex === i;
            return (
              <li key={category.slug} className="py-1">
                <button
                  type="button"
                  onClick={() => setOpenIndex(expanded ? -1 : i)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-ink"
                >
                  {category.name}
                  <ChevronDownIcon
                    className={`h-4 w-4 text-navy/50 transition ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
                {expanded && (
                  <ul className="grid grid-cols-2 gap-2 pb-3">
                    {category.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <a
                          href="#"
                          onClick={onClose}
                          className="block rounded-xl bg-cream px-3 py-2 text-[13px] text-navy/80"
                        >
                          {sub.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-5 grid gap-2">
          <a
            href="#products"
            onClick={onClose}
            className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Shop all prints
          </a>
          <a
            href="#"
            onClick={onClose}
            className="rounded-full border border-navy/15 px-5 py-3 text-center text-sm font-semibold text-navy"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
