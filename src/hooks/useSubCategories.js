"use client";

import { listSubCategories } from "@/api/subCategory.api";
import { useApi } from "./useApi";

/** Subcategories, optionally narrowed to one parent category. */
export function useSubCategories({ category = "", page = 1, limit = 500 } = {}) {
  const { data, ...rest } = useApi(
    () => listSubCategories({ category, page, limit }),
    [category, page, limit]
  );

  return { subcategories: data?.subCategory || [], ...rest };
}
