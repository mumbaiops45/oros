"use client";

import { listProducts } from "@/api/product.api";
import { useApi } from "./useApi";

/**
 * Paginated product list. Every filter the API understands is accepted:
 * search, category, subcategory, status.
 */
export function useProducts({
  page = 1,
  limit = 20,
  search = "",
  category = "",
  subcategory = "",
  status = "",
} = {}) {
  const { data, ...rest } = useApi(
    () => listProducts({ page, limit, search, category, subcategory, status }),
    [page, limit, search, category, subcategory, status]
  );

  return {
    products: data?.products || [],
    pagination: data?.pagination || null,
    ...rest,
  };
}
