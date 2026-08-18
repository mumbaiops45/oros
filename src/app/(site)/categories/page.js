import { Suspense } from "react";
import CategoriesBrowser from "@/components/catalog/CategoriesBrowser";
import CatalogFallback from "@/components/catalog/CatalogFallback";

export const metadata = {
  title: "Shop by category — OROS 3D",
  description:
    "Every category we print for: home and decor, desk and gadgets, figurines, cosplay props and functional parts. Bulk pricing across all of them.",
};

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CatalogFallback count={12} />}>
      <CategoriesBrowser />
    </Suspense>
  );
}
