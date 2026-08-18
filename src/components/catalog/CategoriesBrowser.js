"use client";

import { categories as demoCategories } from "@/data/catalog";
import { useCategories } from "@/hooks/useCategories";
import { useNavCategories } from "@/hooks/useCatalog";
import { usePageParam } from "@/hooks/useQueryState";
import { toNavCategory, toNavDemoCategory } from "@/lib/adapters";
import CatalogHeader from "./CatalogHeader";
import Pagination from "./Pagination";
import { CardSkeleton, ErrorState } from "./CatalogStates";
import { CategoryCard } from "./TaxonomyCards";

const PER_PAGE = 12;

/**
 * Level one of the catalogue: every category, a page at a time.
 *
 * The rows come from the paginated /category endpoint rather than the
 * navigation tree in the store — the tree is a menu, this page has to walk
 * the whole list. The tree is still consulted for two things the list
 * endpoint does not carry: the subcategory count on each card, and the total
 * row count.
 *
 * That total matters because /category answers with rows only — no
 * { total, page, limit, totalPages } envelope, unlike /product. Until it has
 * one, the tree (which holds every category) supplies the count so the pager
 * can still draw real page numbers. The day the endpoint returns an envelope,
 * it takes over on its own.
 */
export default function CategoriesBrowser() {
  const [page, setPage] = usePageParam();

  const { categories: rows, pagination, loading, error, reload } = useCategories({
    page,
    limit: PER_PAGE,
  });

  const { categories: tree } = useNavCategories();

  const live = rows.length > 0;

  // Same fallback the header and the home page rail use: an empty catalogue
  // shows the demo tree rather than a blank page.
  const categories = live
    ? rows
        .filter((row) => row.isActive !== false)
        .map((row) => ({
          ...toNavCategory(row),
          subcategories:
            tree.find((item) => item.slug === row.slug)?.subcategories || [],
        }))
    : demoCategories.map(toNavDemoCategory);

  const knownTotal = pagination?.total ?? (live ? tree.length : categories.length);

  const totalPages =
    pagination?.totalPages ?? Math.max(1, Math.ceil(knownTotal / PER_PAGE));

  const total = knownTotal || categories.length;

  return (
    <>
      <CatalogHeader
        eyebrow="Shop by category"
        title="Every shelf we print for"
        blurb="Pick a category to see the ranges inside it, then open a range for the prints it holds. Bulk pricing applies across all of them."
        trail={[{ label: "Categories" }]}
        count={total}
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
          {error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {loading ? (
                <CardSkeleton count={PER_PAGE} className="aspect-5/4" />
              ) : (
                categories.map((category, index) => (
                  <li key={category.id || category.slug}>
                    <CategoryCard category={category} index={index} />
                  </li>
                ))
              )}
            </ul>
          )}

          {!loading && !error && (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={PER_PAGE}
              // last resort, only when nothing knows the count: a full page
              // probably has another behind it
              hasNext={knownTotal === 0 && categories.length >= PER_PAGE}
              onChange={setPage}
            />
          )}
        </div>
      </section>
    </>
  );
}
