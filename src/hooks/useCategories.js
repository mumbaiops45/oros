"use client";

import { listCategories } from "@/api/category.api";
import { useApi } from "./useApi";

/** Flat category list — used by the admin tables and every category picker. */
export function useCategories({ page = 1, limit = 100 } = {}) {
  const { data, ...rest } = useApi(
    () => listCategories({ page, limit }),
    [page, limit]
  );

  return { categories: data?.category || [], ...rest };
}
