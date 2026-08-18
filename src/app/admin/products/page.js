"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  deleteProduct,
  listCategories,
  listProducts,
  listSubCategories,
} from "@/api";
import { useApi } from "@/hooks/useApi";
import {
  Alert,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  PageHeader,
  Select,
  Spinner,
  Table,
  Td,
} from "@/components/admin/ui";

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const LIMIT = 20;

function ProductsBrowser() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [page, setPage] = useState(1);

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const categories = useApi(() => listCategories({ page: 1, limit: 200 }), []);

  const subcategories = useApi(
    () => listSubCategories({ page: 1, limit: 500, category }),
    [category]
  );

  const products = useApi(
    () =>
      listProducts({
        page,
        limit: LIMIT,
        search: debounced,
        status,
        category,
        subcategory,
      }),
    [page, debounced, status, category, subcategory]
  );

  const pagination = products.data?.pagination;
  const rows = products.data?.products || [];

  const onDelete = async () => {
    setDeleteBusy(true);
    setDeleteError("");

    try {
      await deleteProduct(deleting._id);
      setDeleting(null);
      products.reload();
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Products"
        description={
          pagination
            ? `${pagination.total} product${pagination.total === 1 ? "" : "s"} in the catalogue`
            : "Manage the catalogue"
        }
        actions={
          <>
            <Link href="/admin/bulk">
              <Button variant="secondary">Bulk import</Button>
            </Link>
            <Link href="/admin/products/new">
              <Button>New product</Button>
            </Link>
          </>
        }
      />

      <Alert>{products.error}</Alert>
      <Alert onDismiss={() => setDeleteError("")}>{deleteError}</Alert>

      <Card>
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or SKU…"
          />

          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>

          <Select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setSubcategory("");
              setPage(1);
            }}
          >
            <option value="">All categories</option>
            {(categories.data?.category || []).map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </Select>

          <Select
            value={subcategory}
            onChange={(event) => {
              setSubcategory(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All subcategories</option>
            {(subcategories.data?.subCategory || []).map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>

        {products.loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title="Nothing matches"
            description="Try clearing the filters, or create a product."
            action={
              <Link href="/admin/products/new">
                <Button>New product</Button>
              </Link>
            }
          />
        ) : (
          <Table
            head={["SKU", "Name", "Category", "Price", "MOQ", "Status", "Order", ""]}
          >
            {rows.map((product) => (
              <tr key={product._id} className="hover:bg-slate-50">
                <Td className="font-mono text-xs">{product.sku}</Td>
                <Td>
                  <Link
                    href={`/admin/products/${product._id}`}
                    className="font-semibold hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <span className="block font-mono text-[11px] text-slate-400">
                    {product.slug}
                  </span>
                </Td>
                <Td className="text-slate-500">
                  {product.category?.name || "—"}
                  <span className="block text-xs text-slate-400">
                    {product.subcategory?.name || ""}
                  </span>
                </Td>
                <Td>₹{product.basePrice}</Td>
                <Td>{product.minQty}</Td>
                <Td>
                  <Badge tone={product.status}>{product.status}</Badge>
                </Td>
                <Td className="text-slate-400">{product.sortOrder}</Td>
                <Td className="text-right whitespace-nowrap">
                  <Link
                    href={`/admin/products/${product._id}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleting(product)}
                    className="ml-4 text-sm font-semibold text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete product"
        message={`Delete "${deleting?.name}"? Its specs, options, price slabs and Cloudinary media are deleted with it.`}
        loading={deleteBusy}
        onCancel={() => setDeleting(null)}
        onConfirm={onDelete}
      />
    </>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      }
    >
      <ProductsBrowser />
    </Suspense>
  );
}
