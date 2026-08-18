"use client";

import { getProduct, getProductBySlug } from "@/api/product.api";
import { useApi } from "./useApi";

/**
 * One product with everything hanging off it: specs, media, options with
 * their values, and price slabs.
 */
export function useProduct(id) {
  const { data, ...rest } = useApi(() => getProduct(id), [id]);

  return {
    product: data?.product || null,
    specs: data?.specs || [],
    media: data?.media || [],
    options: data?.options || [],
    priceSlabs: data?.priceSlabs || [],
    ...rest,
  };
}

/** The same payload, looked up by the slug in the storefront URL. */
export function useProductBySlug(slug) {
  const { data, ...rest } = useApi(() => getProductBySlug(slug), [slug]);

  return {
    product: data?.product || null,
    specs: data?.specs || [],
    media: data?.media || [],
    options: data?.options || [],
    priceSlabs: data?.priceSlabs || [],
    ...rest,
  };
}
