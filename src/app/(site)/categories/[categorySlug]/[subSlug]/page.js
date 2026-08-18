import { Suspense } from "react";
import SubcategoryBrowser from "@/components/catalog/SubcategoryBrowser";
import CatalogFallback from "@/components/catalog/CatalogFallback";
import { titleFromSlug } from "@/lib/slug";

export async function generateMetadata({ params }) {
  const { categorySlug, subSlug } = await params;

  return {
    title: `${titleFromSlug(subSlug)} — ${titleFromSlug(categorySlug)} — OROS 3D`,
    description: `Ready-to-ship and made-to-order ${titleFromSlug(subSlug).toLowerCase()}, printed in Mumbai with bulk pricing from 10 units.`,
  };
}

export default async function SubcategoryPage({ params }) {
  const { categorySlug, subSlug } = await params;

  return (
    <Suspense fallback={<CatalogFallback count={12} />}>
      <SubcategoryBrowser categorySlug={categorySlug} subSlug={subSlug} />
    </Suspense>
  );
}
