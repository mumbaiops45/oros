"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useSubCategories } from "@/hooks/useSubCategories";
import { slugify } from "@/lib/slug";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/admin/ui";

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

const EMPTY = {
  sku: "",
  name: "",
  slug: "",
  category: "",
  subcategory: "",
  shortDescription: "",
  longDescription: "",
  basePrice: "",
  taxRate: "0",
  leadTimeDays: "",
  minQty: "1",
  isCustomisable: false,
  status: "DRAFT",
  sortOrder: "",
  seoTitle: "",
  seoDescription: "",
};

const toValues = (product) => {
  if (!product) return EMPTY;

  return {
    sku: product.sku || "",
    name: product.name || "",
    slug: product.slug || "",
    category: product.category?._id || product.category || "",
    subcategory: product.subcategory?._id || product.subcategory || "",
    shortDescription: product.shortDescription || "",
    longDescription: product.longDescription || "",
    basePrice: String(product.basePrice ?? ""),
    taxRate: String(product.taxRate ?? 0),
    leadTimeDays: String(product.leadTimeDays ?? ""),
    minQty: String(product.minQty ?? 1),
    isCustomisable: Boolean(product.isCustomisable),
    status: product.status || "DRAFT",
    sortOrder: String(product.sortOrder ?? ""),
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
  };
};

/**
 * Create and edit share this form. `product` being null means create.
 *
 * `children` render as an extra card above the submit button — the create
 * screen uses it to queue media alongside the fields, since both are saved by
 * the same click.
 */
export default function ProductForm({
  product = null,
  onSubmit,
  submitLabel,
  children,
}) {
  const [values, setValues] = useState(() => toValues(product));
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const { categories } = useCategories();

  const { subcategories: subcategoryOptions } = useSubCategories({
    category: values.category,
  });

  const set = (key) => (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setValues((current) => ({ ...current, [key]: value }));
  };

  // The API rejects a subcategory that belongs to another category, so
  // a category change always clears the pick below it.
  const onCategoryChange = (event) => {
    const category = event.target.value;
    setValues((current) => ({ ...current, category, subcategory: "" }));
  };

  const onNameChange = (event) => {
    const name = event.target.value;
    setValues((current) => ({
      ...current,
      name,
      slug: slugTouched ? current.slug : slugify(name),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);

    const payload = {
      sku: values.sku.trim().toUpperCase(),
      name: values.name.trim(),
      slug: slugify(values.slug || values.name),
      category: values.category,
      subcategory: values.subcategory,
      shortDescription: values.shortDescription,
      longDescription: values.longDescription,
      basePrice: Number(values.basePrice),
      taxRate: Number(values.taxRate || 0),
      leadTimeDays: Number(values.leadTimeDays),
      minQty: Number(values.minQty || 1),
      isCustomisable: values.isCustomisable,
      status: values.status,
      seoTitle: values.seoTitle,
      seoDescription: values.seoDescription,
    };

    // sortOrder shuffles every other product when it is sent, so only
    // include it when the field actually holds a number
    if (values.sortOrder !== "") {
      payload.sortOrder = Number(values.sortOrder);
    }

    try {
      await onSubmit(payload);
      setSaved(true);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Alert onDismiss={() => setError("")}>{error}</Alert>
      {saved && (
        <Alert tone="success" onDismiss={() => setSaved(false)}>
          Product saved.
        </Alert>
      )}

      <Card title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SKU" required hint="Uppercased. Bulk media matches on this.">
            <Input value={values.sku} onChange={set("sku")} required />
          </Field>

          <Field label="Name" required>
            <Input value={values.name} onChange={onNameChange} required />
          </Field>

          <Field label="Slug" required>
            <Input
              value={values.slug}
              onChange={(event) => {
                setSlugTouched(true);
                set("slug")(event);
              }}
              required
            />
          </Field>

          <Field label="Status">
            <Select value={values.status} onChange={set("status")}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Category" required>
            <Select
              value={values.category}
              onChange={onCategoryChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Subcategory"
            required
            hint={
              values.category ? undefined : "Pick a category first."
            }
          >
            <Select
              value={values.subcategory}
              onChange={set("subcategory")}
              disabled={!values.category}
              required
            >
              <option value="">Select a subcategory</option>
              {subcategoryOptions.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="mt-4 space-y-4">
          <Field label="Short description">
            <Textarea
              rows={2}
              value={values.shortDescription}
              onChange={set("shortDescription")}
            />
          </Field>

          <Field label="Long description">
            <Textarea
              rows={5}
              value={values.longDescription}
              onChange={set("longDescription")}
            />
          </Field>
        </div>
      </Card>

      <Card title="Pricing & fulfilment">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Base price (₹)" required>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={values.basePrice}
              onChange={set("basePrice")}
              required
            />
          </Field>

          <Field label="Tax rate (%)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={values.taxRate}
              onChange={set("taxRate")}
            />
          </Field>

          <Field label="Lead time (days)" required>
            <Input
              type="number"
              min="0"
              value={values.leadTimeDays}
              onChange={set("leadTimeDays")}
              required
            />
          </Field>

          <Field label="Minimum order qty">
            <Input
              type="number"
              min="1"
              value={values.minQty}
              onChange={set("minQty")}
            />
          </Field>

          <Field
            label="Sort order"
            hint="Leave empty to append to the end of the catalogue."
          >
            <Input
              type="number"
              min="1"
              value={values.sortOrder}
              onChange={set("sortOrder")}
            />
          </Field>
        </div>

        <Checkbox
          className="mt-4"
          label="Customisable — buyer supplies text or a file"
          checked={values.isCustomisable}
          onChange={set("isCustomisable")}
        />
      </Card>

      <Card title="SEO">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SEO title">
            <Input value={values.seoTitle} onChange={set("seoTitle")} />
          </Field>
          <Field label="SEO description">
            <Input
              value={values.seoDescription}
              onChange={set("seoDescription")}
            />
          </Field>
        </div>
      </Card>

      {children}

      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
