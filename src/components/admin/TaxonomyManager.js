"use client";

import { useState } from "react";
import { slugify } from "@/lib/slug";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  Spinner,
  Table,
  Td,
  Textarea,
} from "@/components/admin/ui";

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
  seoTitle: "",
  seoDescription: "",
  category: "",
};

/**
 * Categories and subcategories are the same screen apart from the
 * parent-category picker, so both routes render this with a different
 * `api` bundle. `parents` being non-null switches the picker on.
 */
export default function TaxonomyManager({
  title,
  description,
  singular,
  rows,
  loading,
  error,
  onReload,
  api,
  parents = null,
  parentLabel = "Category",
  filter = null,
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  /** Opening the form is what seeds it — `row` null means create. */
  const openForm = (row) => {
    setEditing(row);

    setValues(
      row
        ? {
            name: row.name || "",
            slug: row.slug || "",
            description: row.description || "",
            isActive: row.isActive !== false,
            seoTitle: row.seoTitle || "",
            seoDescription: row.seoDescription || "",
            category: row.category?._id || row.category || "",
          }
        : EMPTY
    );

    setSlugTouched(Boolean(row));
    setFile(null);
    setFormError("");
    setOpen(true);
  };

  const set = (key) => (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setValues((current) => ({ ...current, [key]: value }));
  };

  const onNameChange = (event) => {
    const name = event.target.value;
    setValues((current) => ({
      ...current,
      name,
      slug: slugTouched ? current.slug : slugify(name),
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      name: values.name.trim(),
      slug: slugify(values.slug || values.name),
      description: values.description,
      isActive: values.isActive,
      seoTitle: values.seoTitle,
      seoDescription: values.seoDescription,
    };

    if (parents) payload.category = values.category;

    try {
      if (editing) {
        await api.update(editing._id, payload, file);
      } else {
        await api.create(payload, file);
      }

      setOpen(false);
      setEditing(null);
      onReload();
    } catch (submitError) {
      setFormError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    setDeleteBusy(true);
    setDeleteError("");

    try {
      await api.remove(deleting._id);
      setDeleting(null);
      onReload();
    } catch (removeError) {
      setDeleteError(removeError.message);
    } finally {
      setDeleteBusy(false);
    }
  };

  const parentName = (row) => {
    if (!parents) return null;
    const id = row.category?._id || row.category;
    return parents.find((parent) => parent._id === id)?.name || "—";
  };

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={() => openForm(null)}>New {singular}</Button>
        }
      />

      <Alert>{error}</Alert>
      <Alert onDismiss={() => setDeleteError("")}>{deleteError}</Alert>

      <Card actions={filter}>
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-8 w-8" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title={`No ${singular} yet`}
            description={`Create the first ${singular} to start building the catalogue.`}
            action={
              <Button onClick={() => openForm(null)}>New {singular}</Button>
            }
          />
        ) : (
          <Table
            head={[
              "Image",
              "Name",
              "Slug",
              ...(parents ? [parentLabel] : []),
              "Active",
              "",
            ]}
          >
            {rows.map((row) => (
              <tr key={row._id} className="hover:bg-slate-50">
                <Td>
                  {row.image ? (
                    // plain img: cloudinary hosts are not in next.config images.remotePatterns
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.image}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-slate-100" />
                  )}
                </Td>
                <Td className="font-semibold">{row.name}</Td>
                <Td className="font-mono text-xs text-slate-500">{row.slug}</Td>
                {parents && <Td className="text-slate-500">{parentName(row)}</Td>}
                <Td>
                  <Badge tone={row.isActive === false ? "no" : "yes"}>
                    {row.isActive === false ? "Hidden" : "Live"}
                  </Badge>
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => openForm(row)}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(row)}
                    className="ml-4 text-sm font-semibold text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal
        open={open}
        title={editing ? `Edit ${singular}` : `New ${singular}`}
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button form="taxonomy-form" type="submit" loading={saving}>
              {editing ? "Save changes" : `Create ${singular}`}
            </Button>
          </>
        }
      >
        <form id="taxonomy-form" onSubmit={onSubmit} className="space-y-4">
          <Alert onDismiss={() => setFormError("")}>{formError}</Alert>

          <Field label="Name" required>
            <Input value={values.name} onChange={onNameChange} required />
          </Field>

          <Field label="Slug" required hint="Used in the storefront URL.">
            <Input
              value={values.slug}
              onChange={(event) => {
                setSlugTouched(true);
                set("slug")(event);
              }}
              required
            />
          </Field>

          {parents && (
            <Field label={parentLabel} required>
              <Select value={values.category} onChange={set("category")} required>
                <option value="">Select a {parentLabel.toLowerCase()}</option>
                {parents.map((parent) => (
                  <option key={parent._id} value={parent._id}>
                    {parent.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <Field label="Description">
            <Textarea
              rows={3}
              value={values.description}
              onChange={set("description")}
            />
          </Field>

          <Field
            label="Image"
            hint={
              editing?.image
                ? "Leave empty to keep the current image."
                : "jpg, jpeg, png or webp."
            }
          >
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </Field>

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

          <Checkbox
            label="Visible on the storefront"
            checked={values.isActive}
            onChange={set("isActive")}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete ${singular}`}
        message={`Delete "${deleting?.name}"? This also removes its image from Cloudinary and cannot be undone.`}
        loading={deleteBusy}
        onCancel={() => setDeleting(null)}
        onConfirm={onDelete}
      />
    </>
  );
}
