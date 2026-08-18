"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { PRODUCTS_HREF, toCardProduct } from "@/lib/adapters";
import ProductCard from "@/components/ProductCard";
import { ArrowRightIcon } from "@/components/Icons";

export default function FeaturedProducts() {
  // Published products in the order the admin panel sorted them.
  const { products: live, pagination, loading } = useProducts({
    status: "PUBLISHED",
    page: 1,
    limit: 8,
  });

  const products = live.map(toCardProduct);
  const total = pagination?.total || 0;

  return (
    <section id="products" className="bg-cream py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
            Most downloaded, most printed
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Straight off the build plate
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-navy/80 sm:text-base">
            Ready-to-ship prints in stock today. Every card shows its material and
            minimum order quantity — most start at a single piece.
          </p>
        </div>

        {/* Two rows of four on desktop */}
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {loading
            ? [0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                <li
                  key={index}
                  className="h-80 animate-pulse rounded-2xl border border-navy/10 bg-white"
                />
              ))
            : products.map((product, i) => (
                <li key={product.id || product.slug}>
                  <ProductCard product={product} index={i} />
                </li>
              ))}
        </ul>

        {/* Nothing is hard coded here — an empty grid means the catalogue has
            no published products yet, not that the fetch failed. */}
        {!loading && products.length === 0 && (
          <p className="rounded-2xl border border-dashed border-navy/20 bg-white px-6 py-14 text-center text-sm text-navy/60">
            No published products yet. Add them in the admin panel and they
            appear here straight away.
          </p>
        )}

        {/* The rail is only the first page of the catalogue — this opens the
            full, paged grid on /products. */}
        <div className="mt-12 text-center">
          <Link
            href={PRODUCTS_HREF}
            className="group inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            {total > products.length
              ? `Show more — all ${total} prints`
              : "Show all prints"}
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
