"use client";

import { useEffect, useState } from "react";
import { allProducts as demoProducts } from "@/data/catalog";
import { useNavCategories } from "@/hooks/useCatalog";
import { useProducts } from "@/hooks/useProducts";
import { usePageParam, useQueryState } from "@/hooks/useQueryState";
import {
  CATEGORIES_HREF,
  toCardProduct,
  toDemoCardProduct,
} from "@/lib/adapters";
import CatalogHeader from "./CatalogHeader";
import Pagination from "./Pagination";
import ProductGrid from "./ProductGrid";
import { ErrorState } from "./CatalogStates";
import { CloseIcon, SearchIcon } from "@/components/Icons";

const PER_PAGE = 12;

// Every filter resets the pager, or a narrowed list lands on a page that no
// longer exists.
const RESETS = { resetKeys: ["page"] };

const SELECT =
  "w-full appearance-none rounded-full border border-navy/15 bg-white px-4 py-2.5 text-sm font-medium text-navy transition focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none sm:w-52";

/**
 * The whole catalogue in one grid — where the home page's "Show all prints"
 * lands, and where the mega menu's "view all" links point.
 *
 * Search, category and range all live in the query string alongside the page
 * cursor, so any view of this page is a URL somebody can send to someone else.
 */
export default function ProductsBrowser() {
  const [page, setPage] = usePageParam();
  const [search, setSearch] = useQueryState("q", "", RESETS);
  const [categorySlug, setCategorySlug] = useQueryState("category", "", RESETS);
  const [subSlug, setSubSlug] = useQueryState("range", "", RESETS);

  const { categories, live: liveCatalog } = useNavCategories();

  const category = categories.find((item) => item.slug === categorySlug) || null;
  const subcategories = category?.subcategories || [];
  const subcategory = subcategories.find((item) => item.slug === subSlug) || null;

  // The input stays instant while the request waits out a short pause, so a
  // typed word is one call rather than one per keystroke.
  const [draft, setDraft] = useState(search);

  useEffect(() => {
    if (draft === search) return;

    const timer = setTimeout(() => setSearch(draft), 400);
    return () => clearTimeout(timer);
  }, [draft, search, setSearch]);

  // Ids, not slugs — the API filters products by id.
  const { products, pagination, loading, error, reload } = useProducts({
    page,
    limit: PER_PAGE,
    search,
    category: liveCatalog && category ? category.id : "",
    subcategory: liveCatalog && subcategory ? subcategory.id : "",
    status: "PUBLISHED",
  });

  // Same fallback as every other surface: an empty catalogue shows the demo
  // set rather than an empty page. It is filtered in memory since there is no
  // API behind it.
  const usingDemo = !loading && !error && products.length === 0 && !search &&
    !categorySlug && !subSlug && demoProducts.length > 0 && !liveCatalog;

  const cards = usingDemo
    ? demoProducts.map((product) => toDemoCardProduct(product))
    : products.map(toCardProduct);

  const totalPages = usingDemo ? 1 : pagination?.totalPages || 1;
  const total = usingDemo ? cards.length : pagination?.total || cards.length;

  const filtered = Boolean(search || categorySlug || subSlug);

  const clearFilters = () => {
    setDraft("");
    setSearch("");
    setCategorySlug("");
    setSubSlug("");
  };

  return (
    <>
      <CatalogHeader
        eyebrow="All prints"
        title={subcategory?.name || category?.name || "Every print on the shelf"}
        blurb="Ready-to-ship prints and made-to-order runs. Every card shows its minimum order quantity — most start at a single piece."
        trail={[
          ...(category
            ? [{ label: "Categories", href: CATEGORIES_HREF }, { label: category.name }]
            : []),
          { label: "All prints" },
        ]}
        count={total}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative flex-1 sm:min-w-64">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy/40" />
            <input
              type="search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search prints, materials, SKUs…"
              aria-label="Search prints"
              className="w-full rounded-full border border-navy/15 bg-white py-2.5 pr-4 pl-11 text-sm text-navy transition placeholder:text-navy/40 focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none"
            />
          </div>

          <select
            value={categorySlug}
            aria-label="Filter by category"
            onChange={(event) => {
              setCategorySlug(event.target.value);
              // the old range belongs to the old category
              if (subSlug) setSubSlug("");
            }}
            className={SELECT}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.id || item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={subSlug}
            aria-label="Filter by range"
            disabled={!category}
            onChange={(event) => setSubSlug(event.target.value)}
            className={`${SELECT} disabled:cursor-not-allowed disabled:opacity-45`}
          >
            <option value="">
              {category ? "All ranges" : "Pick a category first"}
            </option>
            {subcategories.map((item) => (
              <option key={item.id || item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>

          {filtered && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 self-start rounded-full px-3 py-2.5 text-xs font-bold text-primary transition hover:bg-primary/10"
            >
              <CloseIcon className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </CatalogHeader>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
          {error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : (
            <>
              <ProductGrid
                products={cards}
                loading={loading}
                skeletonCount={PER_PAGE}
                empty={{
                  title: filtered
                    ? "Nothing matched that"
                    : "No published prints yet",
                  blurb: filtered
                    ? "Try a broader search, or clear the filters to see the whole catalogue."
                    : "Products published in the admin panel appear here straight away.",
                  action: filtered
                    ? undefined
                    : { label: "Browse categories", href: CATEGORIES_HREF },
                }}
              />

              {!loading && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  limit={PER_PAGE}
                  onChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
