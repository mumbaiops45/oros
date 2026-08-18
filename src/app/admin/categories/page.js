"use client";

import TaxonomyManager from "@/components/admin/TaxonomyManager";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/api";
import { useApi } from "@/hooks/useApi";

const API = {
  create: createCategory,
  update: updateCategory,
  remove: deleteCategory,
};

export default function AdminCategoriesPage() {
  const { data, error, loading, reload } = useApi(
    () => listCategories({ page: 1, limit: 200 }),
    []
  );

  return (
    <TaxonomyManager
      title="Categories"
      description="Top level groupings shown across the storefront"
      singular="category"
      rows={data?.category || []}
      loading={loading}
      error={error}
      onReload={reload}
      api={API}
    />
  );
}
