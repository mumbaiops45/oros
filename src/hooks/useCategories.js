"use client";

import { listCategories } from "@/api/category.api";
import { useApi } from "./useApi";

/**
 * Paginated category list — used by the admin tables, every category picker
 * and the storefront's category browser, which pages through it.
 */
export function useCategories({ page = 1, limit = 100 } = {}) {
  const { data, ...rest } = useApi(
    () => listCategories({ page, limit }),
    [page, limit]
  );

  return {
    categories: data?.category || [],
    pagination: data?.pagination || null,
    ...rest,
  };
}
