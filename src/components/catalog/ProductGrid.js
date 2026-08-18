import ProductCard from "@/components/ProductCard";
import { CardSkeleton, EmptyState } from "./CatalogStates";

/**
 * The one product grid every browse surface renders — home page rails, a
 * subcategory's listing and /products all hand it the same card shape, so a
 * product looks and links identically wherever it is shown.
 *
 * @param {object} props
 * @param {Array} props.products   card shape from toCardProduct
 * @param {boolean} props.loading  draws skeletons in the grid's own columns
 */
export default function ProductGrid({
  products = [],
  loading = false,
  skeletonCount = 8,
  columns = "grid-cols-2 lg:grid-cols-4",
  empty,
}) {
  if (!loading && products.length === 0) {
    return (
      <EmptyState
        title={empty?.title || "Nothing here yet"}
        blurb={
          empty?.blurb ||
          "No published products in this part of the catalogue yet."
        }
        action={empty?.action}
      />
    );
  }

  return (
    <ul className={`grid gap-4 sm:gap-5 ${columns}`}>
      {loading ? (
        <CardSkeleton count={skeletonCount} />
      ) : (
        products.map((product, index) => (
          <li key={product.id || product.slug || product.name}>
            <ProductCard product={product} index={index} />
          </li>
        ))
      )}
    </ul>
  );
}
