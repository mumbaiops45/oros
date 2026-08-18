"use client";

import { useEffect, useMemo } from "react";
import { categories as demoCategories } from "@/data/catalog";
import { useCatalogStore } from "@/store/catalogStore";
import { toNavCategory, toNavDemoCategory } from "@/lib/adapters";

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

/**
 * The same tree in the one shape every navigation surface reads, demo
 * catalogue included. Until categories have been created in the admin panel
 * the API returns nothing, and an empty menu is worse than the placeholder —
 * so the demo tree stands in, reshaped so nothing downstream can tell.
 *
 * `live` says which of the two is on screen; the subcategory page uses it to
 * decide whether to fetch products or read the nested demo ones.
 */
export function useNavCategories() {
  const { categories: liveCategories, loading, loaded, error } = useCatalog();

  const live = liveCategories.length > 0;

  const categories = useMemo(
    () =>
      live
        ? liveCategories.map(toNavCategory)
        : demoCategories.map(toNavDemoCategory),
    [live, liveCategories]
  );

  return { categories, live, loading, loaded, error };
}

/**
 * One category, addressed by the slug in the URL.
 *
 * The API lists categories by id, so the slug is resolved against the tree
 * that is already in the store rather than costing a second round trip.
 * `notFound` only becomes true once the tree has actually loaded — before
 * that a missing match just means the fetch is still in flight.
 */
export function useCategoryBySlug(slug) {
  const { categories, live, loading, loaded, error } = useNavCategories();

  const category =
    categories.find((item) => item.slug === slug) || null;

  return {
    category,
    live,
    loading: loading || !loaded,
    notFound: loaded && !loading && !category,
    error,
  };
}

/** One subcategory, addressed by both slugs in the URL. */
export function useSubcategoryBySlug(categorySlug, subSlug) {
  const { category, live, loading, notFound, error } =
    useCategoryBySlug(categorySlug);

  const subcategory =
    category?.subcategories?.find((item) => item.slug === subSlug) || null;

  return {
    category,
    subcategory,
    live,
    loading,
    notFound: notFound || (!loading && Boolean(category) && !subcategory),
    error,
  };
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
