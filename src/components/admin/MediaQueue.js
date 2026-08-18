"use client";

import { useRef } from "react";
import {
  MEDIA_ACCEPT,
  formatBytes,
  mediaRejectReason,
  mediaTypeOf,
} from "@/lib/media";
import { Alert, Button, EmptyState, Input } from "@/components/admin/ui";

/**
 * Media staged for a product that does not exist yet.
 *
 * The API can only attach media to a saved product, so on the create screen
 * the files are held here — in the order they will be uploaded — and sent as
 * soon as the product has an id. Position in this list becomes sortOrder.
 */

let nextId = 0;

/** Wraps picked files as queue items, rejecting what the API would refuse. */
export const toQueueItems = (files, existingCount = 0) => {
  const accepted = [];
  const rejected = [];

  for (const file of files) {
    const reason = mediaRejectReason(file);

    if (reason) {
      rejected.push(`${file.name} — ${reason}`);
      continue;
    }

    nextId += 1;

    accepted.push({
      id: `queued-${nextId}`,
      file,
      previewUrl: URL.createObjectURL(file),
      type: mediaTypeOf(file),
      altText: "",
      // the first thing queued is the thumbnail unless told otherwise
      isPrimary: existingCount === 0 && accepted.length === 0,
    });
  }

  return { accepted, rejected };
};

export const revokeQueueItem = (item) => {
  if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
};

export default function MediaQueue({
  items,
  onChange,
  error = "",
  onDismissError,
  progress = null,
  disabled = false,
}) {
  const inputRef = useRef(null);

  const add = (fileList) => {
    const { accepted, rejected } = toQueueItems(
      Array.from(fileList || []),
      items.length
    );

    if (accepted.length) onChange([...items, ...accepted], rejected);
    else if (rejected.length) onChange(items, rejected);

    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (item) => {
    revokeQueueItem(item);

    const remaining = items.filter((entry) => entry.id !== item.id);

    // never leave the set without a thumbnail
    if (item.isPrimary && remaining.length > 0) {
      remaining[0] = { ...remaining[0], isPrimary: true };
    }

    onChange(remaining);
  };

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;

    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];

    onChange(next);
  };

  const update = (index, patch) => {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const makePrimary = (index) =>
    onChange(
      items.map((entry, position) => ({
        ...entry,
        isPrimary: position === index,
      }))
    );

  return (
    <div>
      <Alert onDismiss={onDismissError}>{error}</Alert>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          ref={inputRef}
          type="file"
          multiple
          accept={MEDIA_ACCEPT}
          disabled={disabled}
          onChange={(event) => add(event.target.files)}
          className="max-w-sm"
        />
        <p className="text-xs text-slate-500">
          jpg, png, webp, mp4, mov, webm · up to 100 MB each
        </p>
      </div>

      {progress && (
        <div className="mb-4 rounded-lg bg-sky-50 px-4 py-3 text-sm text-sky-800 ring-1 ring-sky-200 ring-inset">
          Uploading {Math.min(progress.done + 1, progress.total)} of{" "}
          {progress.total} — {progress.name}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sky-200">
            <div
              className="h-full rounded-full bg-sky-600 transition-all"
              style={{
                width: `${(progress.done / progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="No media queued"
          description="Pick the images and videos for this product. They upload in the order shown here as soon as the product is created."
        />
      ) : (
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-xl p-3 ring-1 ring-slate-200"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                {index + 1}
              </span>

              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {item.type === "VIDEO" ? (
                  <video
                    src={item.previewUrl}
                    muted
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // a blob: preview cannot go through the image optimiser
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewUrl}
                    alt=""
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
                <p className="truncate text-sm font-semibold text-navy">
                  {item.file.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {item.type} · {formatBytes(item.file.size)}
                </p>
                <Input
                  className="mt-2"
                  value={item.altText}
                  disabled={disabled}
                  placeholder="Alt text (optional)"
                  onChange={(event) =>
                    update(index, { altText: event.target.value })
                  }
                />
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  disabled={disabled || index === 0}
                  onClick={() => move(index, -1)}
                  aria-label="Move up"
                  title="Move up"
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  disabled={disabled || index === items.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label="Move down"
                  title="Move down"
                >
                  ↓
                </Button>
                {!item.isPrimary && (
                  <Button
                    variant="ghost"
                    disabled={disabled}
                    onClick={() => makePrimary(index)}
                  >
                    Make primary
                  </Button>
                )}
                <Button
                  variant="ghost"
                  disabled={disabled}
                  onClick={() => remove(item)}
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
