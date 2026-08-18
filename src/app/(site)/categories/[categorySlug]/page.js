import { Suspense } from "react";
import CategoryBrowser from "@/components/catalog/CategoryBrowser";
import CatalogFallback from "@/components/catalog/CatalogFallback";
import { titleFromSlug } from "@/lib/slug";

/**
 * The category record lives behind the browser's own session, so the title is
 * derived from the slug rather than fetched — it is the same string the admin
 * panel generated the slug from.
 */
export async function generateMetadata({ params }) {
  const { categorySlug } = await params;
  const name = titleFromSlug(categorySlug);

  return {
    title: `${name} — OROS 3D`,
    description: `Every range of 3D printed ${name.toLowerCase()} we make, with bulk pricing and made-to-order runs.`,
  };
}

export default async function CategoryPage({ params }) {
  const { categorySlug } = await params;

  return (
    <Suspense fallback={<CatalogFallback count={8} />}>
      <CategoryBrowser categorySlug={categorySlug} />
    </Suspense>
  );
}
