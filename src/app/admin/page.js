"use client";

import Link from "next/link";
import { listCategories, listProducts, listSubCategories } from "@/api";
import { useApi } from "@/hooks/useApi";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Spinner,
  Table,
  Td,
} from "@/components/admin/ui";

const loadDashboard = async () => {
  const [all, published, drafts, categories, subcategories] = await Promise.all([
    listProducts({ limit: 6, page: 1 }),
    listProducts({ limit: 1, page: 1, status: "PUBLISHED" }),
    listProducts({ limit: 1, page: 1, status: "DRAFT" }),
    // the category endpoints page without returning a total, so ask for
    // a page big enough to count from
    listCategories({ limit: 200, page: 1 }),
    listSubCategories({ limit: 500, page: 1 }),
  ]);

  return {
    recent: all.products,
    totals: {
      products: all.pagination.total,
      published: published.pagination.total,
      drafts: drafts.pagination.total,
      categories: categories.category.length,
      subcategories: subcategories.subCategory.length,
    },
  };
};

function Stat({ label, value, href }) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 transition hover:ring-primary"
    >
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold text-navy">{value}</p>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { data, error, loading } = useApi(loadDashboard, []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Catalogue at a glance"
        actions={
          <Link href="/admin/products/new">
            <Button>New product</Button>
          </Link>
        }
      />

      <Alert>{error}</Alert>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Stat label="Products" value={data.totals.products} href="/admin/products" />
            <Stat
              label="Published"
              value={data.totals.published}
              href="/admin/products?status=PUBLISHED"
            />
            <Stat
              label="Drafts"
              value={data.totals.drafts}
              href="/admin/products?status=DRAFT"
            />
            <Stat
              label="Categories"
              value={data.totals.categories}
              href="/admin/categories"
            />
            <Stat
              label="Subcategories"
              value={data.totals.subcategories}
              href="/admin/subcategories"
            />
          </div>

          <Card
            className="mt-6"
            title="Recent products"
            actions={
              <Link
                href="/admin/products"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            }
          >
            {data.recent.length === 0 ? (
              <EmptyState
                title="No products yet"
                description="Create one by hand, or import a spreadsheet in bulk."
                action={
                  <Link href="/admin/products/new">
                    <Button>New product</Button>
                  </Link>
                }
              />
            ) : (
              <Table head={["SKU", "Name", "Category", "Price", "Status", ""]}>
                {data.recent.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50">
                    <Td className="font-mono text-xs">{product.sku}</Td>
                    <Td className="font-semibold">{product.name}</Td>
                    <Td className="text-slate-500">
                      {product.category?.name || "—"}
                    </Td>
                    <Td>₹{product.basePrice}</Td>
                    <Td>
                      <Badge tone={product.status}>{product.status}</Badge>
                    </Td>
                    <Td className="text-right">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </Td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </>
      )}
    </>
  );
}
