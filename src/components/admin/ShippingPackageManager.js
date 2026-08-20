"use client";

import { useState } from "react";
import {
  createShippingPackage,
  deleteShippingPackage,
  listShippingPackages,
  updateShippingPackage,
} from "@/api";
import { useApi } from "@/hooks/useApi";
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
  Spinner,
  Table,
  Td,
} from "@/components/admin/ui";

const BLANK = {
  name: "",
  maxWeight: "",
  length: "",
  width: "",
  height: "",
  isActive: true,
};

/** The four numbers the model requires, with the minimums it enforces. */
const NUMBERS = [
  { name: "maxWeight", label: "Max weight (kg)", min: 0, hint: "0 or more" },
  { name: "length", label: "Length (cm)", min: 0.5 },
  { name: "width", label: "Width (cm)", min: 0.5 },
  { name: "height", label: "Height (cm)", min: 0.5 },
];

const toForm = (box) =>
  box
    ? {
        name: box.name ?? "",
        maxWeight: String(box.maxWeight ?? ""),
        length: String(box.length ?? ""),
        width: String(box.width ?? ""),
        height: String(box.height ?? ""),
        isActive: box.isActive !== false,
      }
    : { ...BLANK };

const toPayload = (values) => ({
  name: values.name.trim(),
  maxWeight: Number(values.maxWeight),
  length: Number(values.length),
  width: Number(values.width),
  height: Number(values.height),
  isActive: values.isActive,
});

const volume = (box) =>
  Math.round(box.length * box.width * box.height).toLocaleString("en-IN");

function PackageForm({ values, onChange, onSubmit }) {
  const set = (name) => (event) =>
    onChange({ ...values, [name]: event.target.value });

  return (
    <form id="shipping-package-form" onSubmit={onSubmit} className="grid gap-4">
      <Field label="Package name" required>
        <Input
          value={values.name}
          onChange={set("name")}
          placeholder="Small mailer"
          required
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        {NUMBERS.map((field) => (
          <Field key={field.name} label={field.label} hint={field.hint} required>
            <Input
              type="number"
              step="0.1"
              min={field.min}
              value={values[field.name]}
              onChange={set(field.name)}
              required
            />
          </Field>
        ))}
      </div>

      <Checkbox
        label="Active — the packing engine may use this box"
        checked={values.isActive}
        onChange={(event) =>
          onChange({ ...values, isActive: event.target.checked })
        }
      />
    </form>
  );
}

/**
 * The box catalogue the packing engine picks from when a cart is prepared
 * for shipping. Only active boxes are considered, and a cart cannot be
 * packed at all while the list is empty — hence the warning on that state.
 */
export default function ShippingPackageManager() {
  const { data, error, loading, reload, setError } = useApi(
    () => listShippingPackages(),
    []
  );

  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState(BLANK);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const packages = data?.shippingPackages || [];

  const open = (box = null) => {
    setEditing(box || {});
    setValues(toForm(box));
    setError("");
  };

  const run = async (action) => {
    setBusy(true);
    setError("");

    try {
      await action();
      await reload();
      return true;
    } catch (mutationError) {
      setError(mutationError.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    const payload = toPayload(values);

    const ok = await run(() =>
      editing?._id
        ? updateShippingPackage(editing._id, payload)
        : createShippingPackage(payload)
    );

    if (ok) setEditing(null);
  };

  // Toggling straight from the row is the common edit, so it skips the modal.
  const toggleActive = (box) =>
    run(() => updateShippingPackage(box._id, { isActive: !box.isActive }));

  const confirmDelete = async () => {
    const ok = await run(() => deleteShippingPackage(deleting._id));
    if (ok) setDeleting(null);
  };

  return (
    <>
      <PageHeader
        title="Shipping packages"
        description="The boxes the packing engine fills when a customer checks out"
        actions={<Button onClick={() => open()}>New package</Button>}
      />

      <Alert onDismiss={() => setError("")}>{error}</Alert>

      {!loading && packages.length > 0 && !packages.some((box) => box.isActive) && (
        <Alert tone="info">
          No package is active, so no cart can be packed. Activate at least one.
        </Alert>
      )}

      <Card>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner className="h-8 w-8" />
          </div>
        ) : packages.length === 0 ? (
          <EmptyState
            title="No packages yet"
            description="Add the box sizes you actually ship in — the packing engine picks the smallest one each product fits into."
            action={<Button onClick={() => open()}>New package</Button>}
          />
        ) : (
          <Table head={["Name", "Dimensions (cm)", "Volume cm³", "Max weight", "Active", ""]}>
            {packages.map((box) => (
              <tr key={box._id}>
                <Td className="font-semibold">{box.name}</Td>
                <Td className="font-mono text-xs">
                  {box.length} × {box.width} × {box.height}
                </Td>
                <Td className="text-slate-500">{volume(box)}</Td>
                <Td>{box.maxWeight} kg</Td>
                <Td>
                  <Badge tone={box.isActive ? "yes" : "no"}>
                    {box.isActive ? "Active" : "Off"}
                  </Badge>
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    disabled={busy}
                    onClick={() => toggleActive(box)}
                  >
                    {box.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button variant="ghost" onClick={() => open(box)}>
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => setDeleting(box)}>
                    Delete
                  </Button>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal
        open={Boolean(editing)}
        title={editing?._id ? "Edit package" : "New package"}
        onClose={() => setEditing(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" form="shipping-package-form" loading={busy}>
              Save package
            </Button>
          </>
        }
      >
        <PackageForm values={values} onChange={setValues} onSubmit={submit} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete package"
        message={`Delete "${deleting?.name}"? Carts will no longer be packed into this box.`}
        loading={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
