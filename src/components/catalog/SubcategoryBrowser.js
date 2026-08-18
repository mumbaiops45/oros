"use client";

import Link from "next/link";
import { useSubcategoryBySlug } from "@/hooks/useCatalog";
import { useProducts } from "@/hooks/useProducts";
import { usePageParam } from "@/hooks/useQueryState";
import {
  CATEGORIES_HREF,
  PRODUCTS_HREF,
  categoryHref,
  subcategoryHref,
  toCardProduct,
  toDemoCardProduct,
} from "@/lib/adapters";
import CatalogHeader from "./CatalogHeader";
import Pagination from "./Pagination";
import ProductGrid from "./ProductGrid";
import { ErrorState } from "./CatalogStates";

const PER_PAGE = 12;

/**
 * Level three: the prints inside one range, read from the paginated /product
 * endpoint filtered to this subcategory. Mounted only once the subcategory's
 * real id is known — an empty filter would list the whole catalogue.
 */
function LiveProducts({ category, subcategory }) {
  const [page, setPage] = usePageParam();

  const { products, pagination, loading, error, reload } = useProducts({
    subcategory: subcategory.id,
    status: "PUBLISHED",
    page,
    limit: PER_PAGE,
  });

  if (error) return <ErrorState error={error} onRetry={reload} />;

  return (
    <>
      <ProductGrid
        products={products.map(toCardProduct)}
        loading={loading}
        skeletonCount={PER_PAGE}
        empty={{
          title: `No prints in ${subcategory.name} yet`,
          blurb:
            "Products published to this range in the admin panel appear here straight away.",
          action: { label: "Browse all prints", href: PRODUCTS_HREF },
        }}
      />

      {!loading && (
        <Pagination
          page={page}
          totalPages={pagination?.totalPages || 1}
          total={pagination?.total || products.length}
          limit={PER_PAGE}
          onChange={setPage}
        />
      )}
    </>
  );
}

export default function SubcategoryBrowser({ categorySlug, subSlug }) {
  const { category, subcategory, live, loading, notFound, error } =
    useSubcategoryBySlug(categorySlug, subSlug);

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl px-5 pt-40 pb-28 text-center sm:px-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
          Not found
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">
          No such range
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-navy/75">
          {error || "This range may have been renamed or unpublished."}
        </p>
        <Link
          href={category ? categoryHref(category) : CATEGORIES_HREF}
          className="mt-7 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          {category ? `Back to ${category.name}` : "Browse all categories"}
        </Link>
      </div>
    );
  }

  const siblings = category?.subcategories || [];

  return (
    <>
      <CatalogHeader
        eyebrow={category?.name || "Category"}
        title={subcategory?.name || "Loading…"}
        blurb={
          subcategory?.blurb ||
          "Every print in this range, with its material and minimum order quantity on the card."
        }
        trail={[
          { label: "Categories", href: CATEGORIES_HREF },
          { label: category?.name || "…", href: category ? categoryHref(category) : undefined },
          { label: subcategory?.name || "…" },
        ]}
      >
        {/* Sibling ranges — switching between them is the most likely next
            move, so it stays one click away instead of a trip back up. */}
        {siblings.length > 1 && (
          <ul className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {siblings.map((sibling) => {
              const active = sibling.slug === subSlug;
              return (
                <li key={sibling.id || sibling.slug} className="shrink-0">
                  <Link
                    href={subcategoryHref(category, sibling)}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold transition ${
                      active
                        ? "bg-primary text-white shadow-[0_10px_22px_-12px_rgba(97,150,170,0.9)]"
                        : "bg-white text-navy/70 hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {sibling.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CatalogHeader>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
          {loading || !subcategory ? (
            <ProductGrid loading skeletonCount={PER_PAGE} />
          ) : live ? (
            <LiveProducts category={category} subcategory={subcategory} />
          ) : (
            // The demo catalogue nests its products, so there is nothing to
            // page through — the whole range is already on screen.
            <ProductGrid
              products={(subcategory.products || []).map((product) =>
                toDemoCardProduct(product, {
                  category: category.name,
                  subcategory: subcategory.name,
                })
              )}
            />
          )}
        </div>
      </section>
    </>
  );
}
