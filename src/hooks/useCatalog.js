"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/store/catalogStore";

/**
 * The storefront navigation tree — categories with their subcategories
 * nested. Backed by a store, so the header, the mobile drawer and the home
 * page share a single fetch.
 */
export function useCatalog() {
  const categories = useCatalogStore((state) => state.categories);
  const loading = useCatalogStore((state) => state.loading);
  const loaded = useCatalogStore((state) => state.loaded);
  const error = useCatalogStore((state) => state.error);
  const loadCatalog = useCatalogStore((state) => state.loadCatalog);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  return { categories, loading, loaded, error };
}

/** Products of one subcategory, fetched on first hover and cached. */
export function useSubcategoryProducts(subcategoryId) {
  const entry = useCatalogStore(
    (state) => state.productsBySubcategory[subcategoryId]
  );
  const load = useCatalogStore((state) => state.loadSubcategoryProducts);

  useEffect(() => {
    load(subcategoryId);
  }, [load, subcategoryId]);

  return { products: entry?.items || [], loading: entry?.loading ?? true };
}
