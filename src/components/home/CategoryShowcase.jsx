"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { categories } from "@/data/catalog";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/Icons";

// Full-strength brand colours — one per category. The image fills the card and
// the tone rises from the bottom as a solid scrim behind the caption.
const CARD_TONES = [
  { scrim: "from-navy via-navy/70", title: "text-white", body: "text-white/85" },
  { scrim: "from-ink via-ink/70", title: "text-white", body: "text-white/85" },
  { scrim: "from-primary via-primary/70", title: "text-white", body: "text-white/90" },
  { scrim: "from-onyx via-onyx/70", title: "text-white", body: "text-white/85" },
  { scrim: "from-cream via-cream/75", title: "text-ink", body: "text-navy/80" },
  { scrim: "from-navy via-navy/70", title: "text-white", body: "text-white/85" },
];

export default function CategoryShowcase() {
  const railRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncArrows = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 8);
    setAtEnd(rail.scrollLeft >= max - 8);
  }, []);

  useEffect(() => {
    syncArrows();
    window.addEventListener("resize", syncArrows);
    return () => window.removeEventListener("resize", syncArrows);
  }, [syncArrows]);

  const scrollByCards = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id="categories" className="bg-white pb-16 pt-6 lg:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Shop by category
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Pick a shelf to print for
            </h2>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <a
              href="#products"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Browse all categories
              <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={atStart}
                aria-label="Previous categories"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-navy/15 disabled:hover:bg-transparent disabled:hover:text-navy"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={atEnd}
                aria-label="Next categories"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-navy/15 disabled:hover:bg-transparent disabled:hover:text-navy"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Always a single row — arrows / swipe move it sideways */}
        <ul
          ref={railRef}
          onScroll={syncArrows}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
        >
          {categories.map((category, i) => {
            const tone = CARD_TONES[i % CARD_TONES.length];
            return (
              <li
                key={category.slug}
                className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc(25%-0.75rem)]"
              >
                <a
                  href="#products"
                  className="relative block aspect-5/4 overflow-hidden rounded-md"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 78vw"
                    className="object-cover"
                  />

                  {/* Solid brand tone at the foot, fading up over the photo */}
                  <div
                    className={`absolute inset-0 bg-linear-to-t ${tone.scrim} to-transparent`}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h3 className={`font-display text-lg font-semibold sm:text-xl ${tone.title}`}>
                      {category.name}
                    </h3>
                    <p className={`mt-1 line-clamp-1 text-[13px] leading-relaxed ${tone.body}`}>
                      {category.blurb}
                    </p>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
