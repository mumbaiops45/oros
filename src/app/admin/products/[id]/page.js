"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import {
  MediaPanel,
  OptionsPanel,
  PriceSlabsPanel,
  ShippingPanel,
  SpecsPanel,
} from "@/components/admin/productPanels";
import { getProduct, updateProduct } from "@/api";
import { useApi } from "@/hooks/useApi";
import {
  Alert,
  Badge,
  Button,
  PageHeader,
  Spinner,
} from "@/components/admin/ui";

const TABS = [
  { key: "details", label: "Details" },
  { key: "specs", label: "Specs" },
  { key: "options", label: "Options" },
  { key: "slabs", label: "Price slabs" },
  { key: "media", label: "Media" },
  { key: "shipping", label: "Shipping" },
];

export default function EditProductPage({ params }) {
  // route params arrive as a promise
  const { id } = use(params);

  // ?tab=media is how the create screen links here when its media upload
  // needs finishing by hand
  const requestedTab = useSearchParams().get("tab");

  const [tab, setTab] = useState(
    TABS.some((item) => item.key === requestedTab) ? requestedTab : "details"
  );

  const { data, error, loading, reload } = useApi(
    () => getProduct(id),
    [id]
  );

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <>
        <PageHeader
          title="Product"
          actions={
            <Link href="/admin/products">
              <Button variant="secondary">Back to products</Button>
            </Link>
          }
        />
        <Alert>{error || "Product not found"}</Alert>
      </>
    );
  }

  const { product, specs, options, priceSlabs, media } = data;

  const counts = {
    specs: specs.length,
    options: options.length,
    slabs: priceSlabs.length,
    media: media.length,
  };

  return (
    <>
      <PageHeader
        title={product.name}
        description={
          <>
            <span className="font-mono">{product.sku}</span> ·{" "}
            {product.category?.name} / {product.subcategory?.name}
          </>
        }
        actions={
          <>
            <Badge tone={product.status}>{product.status}</Badge>
            <Link href="/admin/products">
              <Button variant="secondary">Back to products</Button>
            </Link>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-1 rounded-xl bg-white p-1 ring-1 ring-slate-200/80">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === item.key
                ? "bg-primary text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-navy"
            }`}
          >
            {item.label}
            {counts[item.key] > 0 && (
              <span
                className={`ml-2 text-xs ${
                  tab === item.key ? "text-white/70" : "text-slate-400"
                }`}
              >
                {counts[item.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "details" && (
        <ProductForm
          key={product._id}
          product={product}
          submitLabel="Save changes"
          onSubmit={async (payload) => {
            await updateProduct(id, payload);
            await reload();
          }}
        />
      )}

      {tab === "specs" && (
        <SpecsPanel productId={id} specs={specs} onReload={reload} />
      )}

      {tab === "options" && (
        <OptionsPanel productId={id} options={options} onReload={reload} />
      )}

      {tab === "slabs" && (
        <PriceSlabsPanel
          productId={id}
          priceSlabs={priceSlabs}
          onReload={reload}
        />
      )}

      {tab === "media" && (
        <MediaPanel productId={id} media={media} onReload={reload} />
      )}

      {/* The shipping row is not part of GET /product/:id, so the panel
          loads and reloads it on its own. */}
      {tab === "shipping" && (
        <ShippingPanel productId={id} productName={product.name} />
      )}
    </>
  );
}
