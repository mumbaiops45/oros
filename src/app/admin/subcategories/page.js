"use client";

import { useState } from "react";
import TaxonomyManager from "@/components/admin/TaxonomyManager";
import {
  createSubCategory,
  deleteSubCategory,
  listCategories,
  listSubCategories,
  updateSubCategory,
} from "@/api";
import { useApi } from "@/hooks/useApi";
import { Select } from "@/components/admin/ui";

const API = {
  create: createSubCategory,
  update: updateSubCategory,
  remove: deleteSubCategory,
};

export default function AdminSubCategoriesPage() {
  const [categoryFilter, setCategoryFilter] = useState("");

  const categories = useApi(() => listCategories({ page: 1, limit: 200 }), []);

  const subcategories = useApi(
    () => listSubCategories({ page: 1, limit: 500, category: categoryFilter }),
    [categoryFilter]
  );

  return (
    <TaxonomyManager
      title="Subcategories"
      description="Each subcategory belongs to exactly one category"
      singular="subcategory"
      rows={subcategories.data?.subCategory || []}
      loading={subcategories.loading || categories.loading}
      error={subcategories.error || categories.error}
      onReload={subcategories.reload}
      api={API}
      parents={categories.data?.category || []}
      filter={
        <Select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="w-56"
        >
          <option value="">All categories</option>
          {(categories.data?.category || []).map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Select>
      }
    />
  );
}
