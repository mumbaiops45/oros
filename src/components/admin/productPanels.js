"use client";

import { useState } from "react";
import {
  createOption,
  createOptionValue,
  createPriceSlab,
  createSpec,
  deleteMedia,
  deleteOption,
  deleteOptionValue,
  deletePriceSlab,
  deleteSpec,
  updateMedia,
  updateOption,
  updateOptionValue,
  updatePriceSlab,
  updateSpec,
  swapMediaOrder,
  uploadMediaQueue,
  deleteProductShipping,
  getProductShipping,
  saveProductShipping,
} from "@/api";
import { useApi } from "@/hooks/useApi";
import MediaQueue, { revokeQueueItem } from "@/components/admin/MediaQueue";
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
  Select,
  Spinner,
  Table,
  Td,
} from "@/components/admin/ui";

/**
 * Every panel runs one mutation at a time against the API and then asks
 * the page to refetch, so the tabs never drift out of sync with Mongo.
 */
const useMutation = (onReload) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (action) => {
    setBusy(true);
    setError("");

    try {
      await action();
      await onReload();
      return true;
    } catch (mutationError) {
      setError(mutationError.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  return { busy, error, setError, run };
};

/* ==================================================================
   SPECS
   ================================================================== */

export function SpecsPanel({ productId, specs, onReload }) {
  const { busy, error, setError, run } = useMutation(onReload);

  const [draft, setDraft] = useState({ label: "", value: "" });
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const add = async (event) => {
    event.preventDefault();
    const ok = await run(() =>
      createSpec(productId, {
        label: draft.label.trim(),
        value: draft.value.trim(),
        sortOrder: specs.length + 1,
      })
    );
    if (ok) setDraft({ label: "", value: "" });
  };

  const save = async () => {
    const ok = await run(() =>
      updateSpec(productId, editing._id, {
        label: editing.label.trim(),
        value: editing.value.trim(),
        sortOrder: Number(editing.sortOrder) || 1,
      })
    );
    if (ok) setEditing(null);
  };

  return (
    <Card
      title="Specifications"
      description="Material, dimensions, finish — shown as a table on the product page"
    >
      <Alert onDismiss={() => setError("")}>{error}</Alert>

      <form onSubmit={add} className="mb-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <Input
          value={draft.label}
          onChange={(event) => setDraft({ ...draft, label: event.target.value })}
          placeholder="Label — e.g. Material"
          required
        />
        <Input
          value={draft.value}
          onChange={(event) => setDraft({ ...draft, value: event.target.value })}
          placeholder="Value — e.g. PLA"
          required
        />
        <Button type="submit" loading={busy}>
          Add spec
        </Button>
      </form>

      {specs.length === 0 ? (
        <EmptyState title="No specs yet" description="Add the first row above." />
      ) : (
        <Table head={["Order", "Label", "Value", ""]}>
          {specs.map((spec) =>
            editing?._id === spec._id ? (
              <tr key={spec._id} className="bg-primary/5">
                <Td>
                  <Input
                    type="number"
                    min="1"
                    className="w-20"
                    value={editing.sortOrder}
                    onChange={(event) =>
                      setEditing({ ...editing, sortOrder: event.target.value })
                    }
                  />
                </Td>
                <Td>
                  <Input
                    value={editing.label}
                    onChange={(event) =>
                      setEditing({ ...editing, label: event.target.value })
                    }
                  />
                </Td>
                <Td>
                  <Input
                    value={editing.value}
                    onChange={(event) =>
                      setEditing({ ...editing, value: event.target.value })
                    }
                  />
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <Button loading={busy} onClick={save}>
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    className="ml-2"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </Button>
                </Td>
              </tr>
            ) : (
              <tr key={spec._id} className="hover:bg-slate-50">
                <Td className="text-slate-400">{spec.sortOrder}</Td>
                <Td className="font-semibold">{spec.label}</Td>
                <Td>{spec.value}</Td>
                <Td className="text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => setEditing({ ...spec })}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(spec)}
                    className="ml-4 text-sm font-semibold text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </Td>
              </tr>
            )
          )}
        </Table>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete spec"
        message={`Delete the "${deleting?.label}" spec?`}
        loading={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          const ok = await run(() => deleteSpec(productId, deleting._id));
          if (ok) setDeleting(null);
        }}
      />
    </Card>
  );
}

/* ==================================================================
   OPTIONS + VALUES
   ================================================================== */

const OPTION_TYPES = ["SELECT", "TEXT", "COLOR", "FILE"];

function OptionValues({ option, run, busy }) {
  const [draft, setDraft] = useState({
    value: "",
    priceDelta: "0",
    priceMultiplier: "1",
  });
  const [deleting, setDeleting] = useState(null);

  const values = option.values || [];

  const add = async (event) => {
    event.preventDefault();
    const ok = await run(() =>
      createOptionValue(option._id, {
        value: draft.value.trim(),
        priceDelta: Number(draft.priceDelta || 0),
        priceMultiplier: Number(draft.priceMultiplier || 1),
        sortOrder: values.length + 1,
      })
    );
    if (ok) setDraft({ value: "", priceDelta: "0", priceMultiplier: "1" });
  };

  return (
    <div className="mt-3 rounded-xl bg-slate-50 p-4">
      <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Values
      </p>

      {values.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {values.map((value) => (
            <li
              key={value._id}
              className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200"
            >
              <span className="font-semibold text-navy">{value.value}</span>
              <span className="ml-auto text-xs text-slate-500">
                {value.priceDelta >= 0 ? "+" : ""}₹{value.priceDelta} · ×
                {value.priceMultiplier}
              </span>
              <button
                type="button"
                onClick={() => setDeleting(value)}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="grid gap-2 sm:grid-cols-[1fr_7rem_7rem_auto]">
        <Input
          value={draft.value}
          onChange={(event) => setDraft({ ...draft, value: event.target.value })}
          placeholder="Value — e.g. Large"
          required
        />
        <Input
          type="number"
          step="0.01"
          value={draft.priceDelta}
          onChange={(event) =>
            setDraft({ ...draft, priceDelta: event.target.value })
          }
          placeholder="+ ₹"
          title="Price delta"
        />
        <Input
          type="number"
          step="0.01"
          min="0"
          value={draft.priceMultiplier}
          onChange={(event) =>
            setDraft({ ...draft, priceMultiplier: event.target.value })
          }
          placeholder="× 1"
          title="Price multiplier"
        />
        <Button type="submit" variant="secondary" loading={busy}>
          Add
        </Button>
      </form>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete option value"
        message={`Remove "${deleting?.value}"?`}
        loading={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          const ok = await run(() =>
            deleteOptionValue(option._id, deleting._id)
          );
          if (ok) setDeleting(null);
        }}
      />
    </div>
  );
}

export function OptionsPanel({ productId, options, onReload }) {
  const { busy, error, setError, run } = useMutation(onReload);

  const [draft, setDraft] = useState({
    name: "",
    type: "SELECT",
    isRequired: false,
  });
  const [deleting, setDeleting] = useState(null);

  const add = async (event) => {
    event.preventDefault();
    const ok = await run(() =>
      createOption(productId, {
        name: draft.name.trim(),
        type: draft.type,
        isRequired: draft.isRequired,
      })
    );
    if (ok) setDraft({ name: "", type: "SELECT", isRequired: false });
  };

  return (
    <Card
      title="Options"
      description="Buyer facing choices. SELECT options need values; TEXT, COLOR and FILE collect input at checkout."
    >
      <Alert onDismiss={() => setError("")}>{error}</Alert>

      <form
        onSubmit={add}
        className="mb-5 grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-start"
      >
        <Input
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
          placeholder="Option name — e.g. Size"
          required
        />
        <Select
          value={draft.type}
          onChange={(event) => setDraft({ ...draft, type: event.target.value })}
        >
          {OPTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        <div className="flex items-center gap-3">
          <Checkbox
            label="Required"
            checked={draft.isRequired}
            onChange={(event) =>
              setDraft({ ...draft, isRequired: event.target.checked })
            }
          />
          <Button type="submit" loading={busy}>
            Add
          </Button>
        </div>
      </form>

      {options.length === 0 ? (
        <EmptyState
          title="No options yet"
          description="Add one above — for example Size, Colour or Engraving text."
        />
      ) : (
        <div className="space-y-4">
          {options.map((option) => (
            <div
              key={option._id}
              className="rounded-xl p-4 ring-1 ring-slate-200"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-navy">{option.name}</span>
                <Badge>{option.type}</Badge>
                {option.isRequired && <Badge tone="yes">Required</Badge>}

                <div className="ml-auto flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      run(() =>
                        updateOption(productId, option._id, {
                          isRequired: !option.isRequired,
                        })
                      )
                    }
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {option.isRequired ? "Make optional" : "Make required"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(option)}
                    className="text-sm font-semibold text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {option.type === "SELECT" && (
                <OptionValues option={option} run={run} busy={busy} />
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete option"
        message={`Delete "${deleting?.name}" and all of its values?`}
        loading={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          const ok = await run(() => deleteOption(productId, deleting._id));
          if (ok) setDeleting(null);
        }}
      />
    </Card>
  );
}

/* ==================================================================
   PRICE SLABS
   ================================================================== */

export function PriceSlabsPanel({ productId, priceSlabs, onReload }) {
  const { busy, error, setError, run } = useMutation(onReload);

  const [draft, setDraft] = useState({ minQty: "", maxQty: "", unitPrice: "" });
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const toPayload = (source) => ({
    minQty: Number(source.minQty),
    maxQty: source.maxQty === "" ? null : Number(source.maxQty),
    unitPrice: Number(source.unitPrice),
  });

  const add = async (event) => {
    event.preventDefault();
    const ok = await run(() => createPriceSlab(productId, toPayload(draft)));
    if (ok) setDraft({ minQty: "", maxQty: "", unitPrice: "" });
  };

  const save = async () => {
    const ok = await run(() =>
      updatePriceSlab(productId, editing._id, toPayload(editing))
    );
    if (ok) setEditing(null);
  };

  return (
    <Card
      title="Price slabs"
      description="Quantity breaks. Leave the max empty for an “and above” tier — slabs may not overlap."
    >
      <Alert onDismiss={() => setError("")}>{error}</Alert>

      <form
        onSubmit={add}
        className="mb-5 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
      >
        <Input
          type="number"
          min="1"
          value={draft.minQty}
          onChange={(event) => setDraft({ ...draft, minQty: event.target.value })}
          placeholder="Min qty"
          required
        />
        <Input
          type="number"
          min="1"
          value={draft.maxQty}
          onChange={(event) => setDraft({ ...draft, maxQty: event.target.value })}
          placeholder="Max qty (empty = and above)"
        />
        <Input
          type="number"
          min="0"
          step="0.01"
          value={draft.unitPrice}
          onChange={(event) =>
            setDraft({ ...draft, unitPrice: event.target.value })
          }
          placeholder="Unit price ₹"
          required
        />
        <Button type="submit" loading={busy}>
          Add slab
        </Button>
      </form>

      {priceSlabs.length === 0 ? (
        <EmptyState
          title="No price slabs"
          description="Without slabs the storefront falls back to the base price."
        />
      ) : (
        <Table head={["Quantity", "Unit price", ""]}>
          {priceSlabs.map((slab) =>
            editing?._id === slab._id ? (
              <tr key={slab._id} className="bg-primary/5">
                <Td>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      className="w-24"
                      value={editing.minQty}
                      onChange={(event) =>
                        setEditing({ ...editing, minQty: event.target.value })
                      }
                    />
                    <span className="text-slate-400">to</span>
                    <Input
                      type="number"
                      min="1"
                      className="w-24"
                      value={editing.maxQty}
                      onChange={(event) =>
                        setEditing({ ...editing, maxQty: event.target.value })
                      }
                      placeholder="∞"
                    />
                  </div>
                </Td>
                <Td>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-28"
                    value={editing.unitPrice}
                    onChange={(event) =>
                      setEditing({ ...editing, unitPrice: event.target.value })
                    }
                  />
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <Button loading={busy} onClick={save}>
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    className="ml-2"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </Button>
                </Td>
              </tr>
            ) : (
              <tr key={slab._id} className="hover:bg-slate-50">
                <Td className="font-semibold">
                  {slab.minQty} – {slab.maxQty ?? "and above"}
                </Td>
                <Td>₹{slab.unitPrice}</Td>
                <Td className="text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({
                        _id: slab._id,
                        minQty: String(slab.minQty),
                        maxQty: slab.maxQty === null ? "" : String(slab.maxQty),
                        unitPrice: String(slab.unitPrice),
                      })
                    }
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(slab)}
                    className="ml-4 text-sm font-semibold text-rose-600 hover:underline"
                  >
                    Delete
                  </button>
                </Td>
              </tr>
            )
          )}
        </Table>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete price slab"
        message={`Delete the ${deleting?.minQty}+ tier?`}
        loading={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          const ok = await run(() => deletePriceSlab(productId, deleting._id));
          if (ok) setDeleting(null);
        }}
      />
    </Card>
  );
}

/* ==================================================================
   MEDIA
   ================================================================== */

/**
 * Media for a saved product. Order is the sortOrder column, so the list is
 * shown sorted by it and a move swaps the two rows it sits between — the API
 * has no reorder endpoint of its own.
 */
export function MediaPanel({ productId, media, onReload }) {
  const { busy, error, setError, run } = useMutation(onReload);

  const [queue, setQueue] = useState([]);
  const [queueError, setQueueError] = useState("");
  const [progress, setProgress] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // isPrimary floats the thumbnail to the top of the API's own sort, which
  // hides the real order — so order by sortOrder here and badge the primary.
  const ordered = [...media].sort((a, b) => a.sortOrder - b.sortOrder);

  const nextSortOrder =
    ordered.reduce((max, item) => Math.max(max, item.sortOrder), 0) + 1;

  const onQueueChange = (next, rejected) => {
    setQueue(next);
    if (rejected?.length) setQueueError(rejected.join(" · "));
  };

  const uploadQueue = async () => {
    if (queue.length === 0) return;

    const ok = await run(() =>
      uploadMediaQueue(productId, queue, {
        startAt: nextSortOrder,
        onProgress: setProgress,
      })
    );

    setProgress(null);

    if (ok) {
      queue.forEach(revokeQueueItem);
      setQueue([]);
    }
  };

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= ordered.length) return undefined;

    return run(() =>
      swapMediaOrder(productId, ordered[index], ordered[target])
    );
  };

  return (
    <div className="space-y-5">
      <Card
        title="Add media"
        description="Uploads go straight to Cloudinary, in the order queued below."
        actions={
          <Button
            loading={busy && Boolean(progress)}
            disabled={queue.length === 0}
            onClick={uploadQueue}
          >
            Upload {queue.length > 0 ? queue.length : ""}
          </Button>
        }
      >
        <MediaQueue
          items={queue}
          onChange={onQueueChange}
          error={queueError}
          onDismissError={() => setQueueError("")}
          progress={progress}
          disabled={busy}
        />
      </Card>

      <Card
        title="Current media"
        description={
          ordered.length > 0
            ? "Move a row up or down to change where it appears on the product page."
            : undefined
        }
      >
        <Alert onDismiss={() => setError("")}>{error}</Alert>

        {ordered.length === 0 ? (
          <EmptyState
            title="No media yet"
            description="Upload above, or drop SKU-named files on the bulk import screen."
          />
        ) : (
          <ol className="space-y-3">
            {ordered.map((item, index) => (
              <li
                key={item._id}
                className="flex flex-wrap items-center gap-4 rounded-xl p-3 ring-1 ring-slate-200"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                  {index + 1}
                </span>

                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {item.type === "VIDEO" ? (
                    <video
                      src={item.url}
                      poster={item.posterUrl || undefined}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.altText || ""}
                      className="h-full w-full object-cover"
                    />
                  )}
                  {item.isPrimary && (
                    <span className="absolute inset-x-0 bottom-0 bg-primary py-0.5 text-center text-[10px] font-bold text-white">
                      Primary
                    </span>
                  )}
                </div>

                <div className="min-w-48 flex-1">
                  <p className="text-sm font-semibold text-navy">
                    {item.type}
                    <span className="ml-2 font-normal text-slate-400">
                      order {item.sortOrder}
                    </span>
                  </p>

                  {editing?._id === item._id ? (
                    <div className="mt-2 flex gap-2">
                      <Input
                        autoFocus
                        value={editing.altText}
                        placeholder="Alt text"
                        onChange={(event) =>
                          setEditing({ ...editing, altText: event.target.value })
                        }
                      />
                      <Button
                        loading={busy}
                        onClick={async () => {
                          const ok = await run(() =>
                            updateMedia(productId, item._id, {
                              altText: editing.altText,
                            })
                          );
                          if (ok) setEditing(null);
                        }}
                      >
                        Save
                      </Button>
                      <Button variant="ghost" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {item.altText || "No alt text"}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    disabled={busy || index === 0}
                    onClick={() => move(index, -1)}
                    aria-label="Move up"
                    title="Move up"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={busy || index === ordered.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label="Move down"
                    title="Move down"
                  >
                    ↓
                  </Button>
                  {!editing && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setEditing({
                          _id: item._id,
                          altText: item.altText || "",
                        })
                      }
                    >
                      Alt text
                    </Button>
                  )}
                  {!item.isPrimary && (
                    <Button
                      variant="ghost"
                      disabled={busy}
                      onClick={() =>
                        run(() =>
                          updateMedia(productId, item._id, { isPrimary: true })
                        )
                      }
                    >
                      Make primary
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    disabled={busy}
                    onClick={() => setDeleting(item)}
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        )}

        <ConfirmDialog
          open={Boolean(deleting)}
          title="Delete media"
          message="This also removes the asset from Cloudinary."
          loading={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            const ok = await run(() => deleteMedia(productId, deleting._id));
            if (ok) setDeleting(null);
          }}
        />
      </Card>
    </div>
  );
}

/* ==================================================================
   SHIPPING  (weight + box dimensions)
   ================================================================== */

export const BLANK_SHIPPING = { weight: "", length: "", width: "", height: "" };

/** The model's own minimums — the API rejects anything under them. */
const SHIPPING_FIELDS = [
  {
    name: "weight",
    label: "Weight (kg)",
    min: 0,
    hint: "Packed weight of one unit",
  },
  { name: "length", label: "Length (cm)", min: 0.5 },
  { name: "width", label: "Width (cm)", min: 0.5 },
  { name: "height", label: "Height (cm)", min: 0.5 },
];

/** Numbers on the wire, strings in the inputs. */
export const toShippingPayload = (values) => ({
  weight: Number(values.weight),
  length: Number(values.length),
  width: Number(values.width),
  height: Number(values.height),
});

/** True once all four are filled in — a partial row is not worth sending. */
export const hasShippingValues = (values) =>
  SHIPPING_FIELDS.every((field) => String(values?.[field.name] || "").trim());

/**
 * The four inputs on their own, so the create screen can collect them
 * before the product exists and this panel can edit them after.
 */
export function ShippingFields({ values, onChange, disabled, required = true }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SHIPPING_FIELDS.map((field) => (
        <Field key={field.name} label={field.label} hint={field.hint} required={required}>
          <Input
            type="number"
            step="0.1"
            min={field.min}
            value={values[field.name]}
            disabled={disabled}
            onChange={(event) =>
              onChange({ ...values, [field.name]: event.target.value })
            }
            required={required}
          />
        </Field>
      ))}
    </div>
  );
}

/**
 * One shipping row per product, and the packing engine refuses to pack a
 * cart containing a product without one — so this is required before a
 * product can actually be sold, not an optional extra.
 *
 * The row is not part of GET /product/:id, so the panel fetches it itself
 * and the same form covers create and edit.
 */
export function ShippingPanel({ productId, productName }) {
  const { data, error, loading, reload, setError } = useApi(
    () => getProductShipping(productId),
    [productId]
  );

  const shipping = data?.shipping || null;

  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // `draft` stays null until the row lands, then mirrors it — so the inputs
  // are never rendered with values from the previous product.
  const values =
    draft ??
    (shipping
      ? {
          weight: String(shipping.weight ?? ""),
          length: String(shipping.length ?? ""),
          width: String(shipping.width ?? ""),
          height: String(shipping.height ?? ""),
        }
      : { ...BLANK_SHIPPING });

  const run = async (action) => {
    setBusy(true);
    setSaveError("");

    try {
      await action();
      setDraft(null);
      await reload();
      return true;
    } catch (mutationError) {
      setSaveError(mutationError.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const save = (event) => {
    event.preventDefault();

    return run(() =>
      saveProductShipping(productId, shipping?._id, toShippingPayload(values))
    );
  };

  const remove = async () => {
    const ok = await run(() => deleteProductShipping(shipping._id));
    if (ok) setDeleting(false);
  };

  if (loading) {
    return (
      <Card title="Shipping">
        <div className="flex justify-center py-10">
          <Spinner className="h-8 w-8" />
        </div>
      </Card>
    );
  }

  const volume =
    values.length && values.width && values.height
      ? Math.round(
          Number(values.length) * Number(values.width) * Number(values.height)
        )
      : null;

  return (
    <Card
      title="Shipping"
      description="Packed weight and box size of a single unit — the packing engine needs both before this product can be checked out"
      actions={
        <Badge tone={shipping ? "yes" : "no"}>{shipping ? "Set" : "Missing"}</Badge>
      }
    >
      <Alert onDismiss={() => setError("")}>{error}</Alert>
      <Alert onDismiss={() => setSaveError("")}>{saveError}</Alert>

      {!shipping && (
        <Alert tone="info">
          {productName ? `“${productName}”` : "This product"} has no shipping
          details, so any cart containing it cannot be packed.
        </Alert>
      )}

      <form onSubmit={save} className="grid gap-4">
        <ShippingFields values={values} onChange={setDraft} disabled={busy} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {volume
              ? `Volume ${volume.toLocaleString("en-IN")} cm³ — this must fit inside one of the shipping boxes.`
              : "Fill in all four to see the volume."}
          </p>

          <div className="flex gap-2">
            {shipping && (
              <Button
                variant="secondary"
                disabled={busy}
                onClick={() => setDeleting(true)}
              >
                Delete
              </Button>
            )}
            <Button type="submit" loading={busy}>
              {shipping ? "Save shipping" : "Add shipping"}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={deleting}
        title="Delete shipping details"
        message="Without weight and dimensions this product can no longer be packed into a shipment."
        loading={busy}
        onCancel={() => setDeleting(false)}
        onConfirm={remove}
      />
    </Card>
  );
}
