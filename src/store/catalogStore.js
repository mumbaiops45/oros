"use client";

import { create } from "zustand";
import { listCategories } from "@/api/category.api";
import { listSubCategories } from "@/api/subCategory.api";
import { listProducts } from "@/api/product.api";

/**
 * The navigation tree, fetched once per page load and shared by the desktop
 * mega menu, the mobile drawer and the category rail on the home page.
 *
 * Products are NOT part of that tree — the API keeps them in their own
 * collection — so the mega menu asks for a subcategory's products the first
 * time it is hovered and they are cached here from then on.
 */
export const useCatalogStore = create((set, get) => ({
  categories: [],
  loading: false,
  loaded: false,
  error: "",

  productsBySubcategory: {},

  loadCatalog: async () => {
    // one in-flight fetch per page load, no matter how many components ask
    if (get().loading || get().loaded) return;

    set({ loading: true, error: "" });

    try {
      const [categoryData, subcategoryData] = await Promise.all([
        listCategories({ page: 1, limit: 100 }),
        listSubCategories({ page: 1, limit: 500 }),
      ]);

      const subcategories = (subcategoryData?.subCategory || []).filter(
        (item) => item.isActive !== false
      );

      const categories = (categoryData?.category || [])
        .filter((item) => item.isActive !== false)
        .map((category) => ({
          ...category,
          subcategories: subcategories.filter(
            (sub) => String(sub.category?._id || sub.category) === String(category._id)
          ),
        }));

      set({ categories, loading: false, loaded: true });
    } catch (error) {
      set({ error: error.message, loading: false, loaded: true });
    }
  },

  loadSubcategoryProducts: async (subcategoryId) => {
    if (!subcategoryId) return;

    const cached = get().productsBySubcategory[subcategoryId];
    if (cached) return;

    set((state) => ({
      productsBySubcategory: {
        ...state.productsBySubcategory,
        [subcategoryId]: { loading: true, items: [] },
      },
    }));

    try {
      const data = await listProducts({
        subcategory: subcategoryId,
        status: "PUBLISHED",
        page: 1,
        limit: 4,
      });

      set((state) => ({
        productsBySubcategory: {
          ...state.productsBySubcategory,
          [subcategoryId]: { loading: false, items: data?.products || [] },
        },
      }));
    } catch {
      set((state) => ({
        productsBySubcategory: {
          ...state.productsBySubcategory,
          [subcategoryId]: { loading: false, items: [] },
        },
      }));
    }
  },
}));
