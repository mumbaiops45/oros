"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import MediaQueue, { revokeQueueItem } from "@/components/admin/MediaQueue";
import { createProduct, uploadMediaQueue } from "@/api";
import { Alert, Button, Card, PageHeader } from "@/components/admin/ui";

export default function NewProductPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [queueError, setQueueError] = useState("");
  const [progress, setProgress] = useState(null);

  // Set when the product saved but its media did not — the product exists at
  // that point, so resubmitting would only trip the duplicate SKU check.
  const [stranded, setStranded] = useState(null);

  const onQueueChange = (next, rejected) => {
    setItems(next);
    if (rejected?.length) setQueueError(rejected.join(" · "));
  };

  const onSubmit = async (payload) => {
    // Media needs a product id, so the product is created first and the
    // queued files follow immediately in the order shown on screen.
    const data = await createProduct(payload);
    const productId = data.product._id;

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
          description="The media upload did not finish"
        />

        <Alert>
          {stranded.name} was saved, but uploading its media failed:{" "}
          {stranded.message}
        </Alert>

        <Card title="Finish the media">
          <p className="text-sm text-slate-600">
            The product exists now, so add the remaining files on its media tab
            rather than creating it again.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href={`/admin/products/${stranded.id}?tab=media`}>
              <Button>Open media tab</Button>
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
        description="Add its images and videos here too — specs, options and price slabs come after saving"
        actions={
          <Link href="/admin/products">
            <Button variant="secondary">Back to products</Button>
          </Link>
        }
      />

      <ProductForm onSubmit={onSubmit} submitLabel="Create product">
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
