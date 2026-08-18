"use client";

import Link from "next/link";
import { useCategoryBySlug } from "@/hooks/useCatalog";
import { useSubCategories } from "@/hooks/useSubCategories";
import { usePageParam } from "@/hooks/useQueryState";
import { CATEGORIES_HREF, CATEGORY_IMAGE_FALLBACK } from "@/lib/adapters";
import CatalogHeader from "./CatalogHeader";
import Pagination from "./Pagination";
import { CardSkeleton, EmptyState, ErrorState } from "./CatalogStates";
import { SubcategoryCard } from "./TaxonomyCards";

const PER_PAGE = 12;

const GRID = "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4";

/**
 * Level two: the ranges inside one category, read from the paginated
 * /subCategory endpoint. Only mounted once the category's real id is known,
 * so the request is never sent with an empty filter — that would list the
 * whole catalogue.
 */
function LiveSubcategories({ category }) {
  const [page, setPage] = usePageParam();

  const { subcategories, pagination, loading, error, reload } = useSubCategories({
    category: category.id,
    page,
    limit: PER_PAGE,
  });

  if (error) return <ErrorState error={error} onRetry={reload} />;

  const rows = subcategories
    .filter((row) => row.isActive !== false)
    .map((row) => ({
      id: row._id,
      name: row.name,
      slug: row.slug,
      blurb: row.description || "",
      image: row.image || CATEGORY_IMAGE_FALLBACK,
    }));

  const knownTotal =
    pagination?.total ?? category.subcategories?.length ?? rows.length;

  const totalPages =
    pagination?.totalPages ?? Math.max(1, Math.ceil(knownTotal / PER_PAGE));

  const total = knownTotal || rows.length;

  if (!loading && rows.length === 0) {
    return (
      <EmptyState
        title={`No ranges in ${category.name} yet`}
        blurb="Subcategories added in the admin panel appear here straight away."
        action={{ label: "Browse all categories", href: CATEGORIES_HREF }}
      />
    );
  }

  return (
    <>
      <ul className={GRID}>
        {loading ? (
          <CardSkeleton count={PER_PAGE} className="h-72" />
        ) : (
          rows.map((subcategory) => (
            <li key={subcategory.id}>
              <SubcategoryCard category={category} subcategory={subcategory} />
            </li>
          ))
        )}
      </ul>

      {/* /subCategory answers with rows only, no pagination envelope, so the
          count falls back to the nav tree — which holds every range in this
          category. An envelope, once the endpoint returns one, wins. */}
      {!loading && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={PER_PAGE}
          hasNext={knownTotal === 0 && rows.length >= PER_PAGE}
          onChange={setPage}
        />
      )}
    </>
  );
}

/** The demo catalogue nests its ranges, so there is nothing to page through. */
function DemoSubcategories({ category }) {
  return (
    <ul className={GRID}>
      {category.subcategories.map((subcategory) => (
        <li key={subcategory.slug}>
          <SubcategoryCard
            category={category}
            subcategory={subcategory}
            count={subcategory.products?.length}
          />
        </li>
      ))}
    </ul>
  );
}

export default function CategoryBrowser({ categorySlug }) {
  const { category, live, loading, notFound, error } =
    useCategoryBySlug(categorySlug);

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl px-5 pt-40 pb-28 text-center sm:px-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
          Not found
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
          No such category
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-navy/75">
          {error || "This category may have been renamed or unpublished."}
        </p>
        <Link
          href={CATEGORIES_HREF}
          className="mt-7 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          Browse all categories
        </Link>
      </div>
    );
  }

  return (
    <>
      <CatalogHeader
        eyebrow="Category"
        title={category?.name || "Loading…"}
        blurb={
          category?.blurb ||
          "Pick a range to see everything we print inside it."
        }
        trail={[
          { label: "Categories", href: CATEGORIES_HREF },
          { label: category?.name || "…" },
        ]}
        count={category?.subcategories?.length}
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
          {loading || !category ? (
            <ul className={GRID}>
              <CardSkeleton count={8} className="h-72" />
            </ul>
          ) : live ? (
            <LiveSubcategories category={category} />
          ) : (
            <DemoSubcategories category={category} />
          )}
        </div>
      </section>
    </>
  );
}
