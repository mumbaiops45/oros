import { Suspense } from "react";
import ProductsBrowser from "@/components/catalog/ProductsBrowser";
import CatalogFallback from "@/components/catalog/CatalogFallback";

export const metadata = {
  title: "All 3D printed products — OROS 3D",
  description:
    "The whole OROS catalogue: ready-to-ship 3D printed decor, desk gear, figurines, cosplay props and functional parts. Search, filter by category and order in bulk.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogFallback count={12} />}>
      <ProductsBrowser />
    </Suspense>
  );
}
