"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import MediaQueue, { revokeQueueItem } from "@/components/admin/MediaQueue";
import {
  BLANK_SHIPPING,
  ShippingFields,
  hasShippingValues,
  toShippingPayload,
} from "@/components/admin/productPanels";
import { createProduct, createProductShipping, uploadMediaQueue } from "@/api";
import { Alert, Button, Card, PageHeader } from "@/components/admin/ui";

export default function NewProductPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [queueError, setQueueError] = useState("");
  const [progress, setProgress] = useState(null);
  const [shipping, setShipping] = useState({ ...BLANK_SHIPPING });

  // Set when the product saved but something after it did not — the product
  // exists at that point, so resubmitting would only trip the duplicate SKU
  // check. `tab` is where the admin has to finish the job by hand.
  const [stranded, setStranded] = useState(null);

  const onQueueChange = (next, rejected) => {
    setItems(next);
    if (rejected?.length) setQueueError(rejected.join(" · "));
  };

  const onSubmit = async (payload) => {
    // Both media and shipping need a product id, so the product is created
    // first and they follow immediately.
    const data = await createProduct(payload);
    const productId = data.product._id;

    if (hasShippingValues(shipping)) {
      try {
        await createProductShipping(productId, toShippingPayload(shipping));
      } catch (shippingError) {
        setStranded({
          id: productId,
          name: payload.name,
          message: shippingError.message,
          tab: "shipping",
          what: "saving its weight and dimensions",
          fix: "Set them on its shipping tab rather than creating the product again.",
        });
        return;
      }
    }

    if (items.length === 0) {
      router.push(`/admin/products/${productId}`);
      return;
    }

    try {
      await uploadMediaQueue(productId, items, { onProgress: setProgress });
      items.forEach(revokeQueueItem);
      router.push(`/admin/products/${productId}`);
    } catch (uploadError) {
      setStranded({
        id: productId,
        name: payload.name,
        message: uploadError.message,
        tab: "media",
        what: "uploading its media",
        fix: "Add the remaining files on its media tab rather than creating it again.",
      });
    } finally {
      setProgress(null);
    }
  };

  if (stranded) {
    return (
      <>
        <PageHeader
          title="Product created"
          description={`${stranded.what} did not finish`}
        />

        <Alert>
          {stranded.name} was saved, but {stranded.what} failed:{" "}
          {stranded.message}
        </Alert>

        <Card title="Finish the setup">
          <p className="text-sm text-slate-600">
            The product exists now. {stranded.fix}
          </p>
          <div className="mt-4 flex gap-2">
            <Link href={`/admin/products/${stranded.id}?tab=${stranded.tab}`}>
              <Button>Open {stranded.tab} tab</Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="secondary">Back to products</Button>
            </Link>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="New product"
        description="Add its images, weight and dimensions here too — specs, options and price slabs come after saving"
        actions={
          <Link href="/admin/products">
            <Button variant="secondary">Back to products</Button>
          </Link>
        }
      />

      <ProductForm onSubmit={onSubmit} submitLabel="Create product">
        <Card
          title="Shipping"
          description="Packed weight and box size of a single unit. A cart cannot be packed while a product in it has none — leave blank to fill in later."
        >
          {/* Optional here, required before the product can be checked out —
              the shipping tab says so once the product exists. */}
          <ShippingFields
            values={shipping}
            onChange={setShipping}
            disabled={Boolean(progress)}
            required={false}
          />
        </Card>

        <Card
          title="Media"
          description="Uploaded in the order below as soon as the product is created. The primary one is the catalogue thumbnail."
        >
          <MediaQueue
            items={items}
            onChange={onQueueChange}
            error={queueError}
            onDismissError={() => setQueueError("")}
            progress={progress}
            disabled={Boolean(progress)}
          />
        </Card>
      </ProductForm>
    </>
  );
}
