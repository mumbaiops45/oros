"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";

/**
 * The window of page numbers to draw. Always shows the first and last page
 * plus the two either side of the current one, with an ellipsis standing in
 * for whatever that skips — so a 40 page catalogue still fits on a phone.
 */
const pageWindow = (page, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const window = new Set([1, totalPages, page]);

  for (const offset of [-2, -1, 1, 2]) {
    const candidate = page + offset;
    if (candidate > 1 && candidate < totalPages) window.add(candidate);
  }

  const pages = [...window].sort((a, b) => a - b);

  return pages.flatMap((value, index) => {
    const previous = pages[index - 1];
    // a gap of more than one page collapses into a single ellipsis
    return previous && value - previous > 1 ? [`gap-${value}`, value] : [value];
  });
};

const BUTTON =
  "flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition";

/**
 * @param {object} props
 * @param {number} props.page          1-based, as the API counts them
 * @param {number} [props.totalPages]  omit when the endpoint returns no count
 * @param {(page: number) => void} props.onChange
 * @param {number} [props.total]       row count, shown as "showing x–y of n"
 * @param {number} [props.limit]       page size, needed for that range
 * @param {boolean} [props.hasNext]    stands in for totalPages when the count
 *                                     is unknown — the pager then draws
 *                                     prev/next only, with no numbers
 * @param {string} [props.tone]        "light" on a dark band
 */
export default function Pagination({
  page,
  totalPages,
  onChange,
  total,
  limit,
  hasNext = false,
  tone = "dark",
}) {
  const numbered = totalPages > 1;

  // One page, and nothing beyond it — there is nothing to page through.
  if (!numbered && !hasNext && page <= 1) return null;

  const light = tone === "light";

  const idle = light
    ? "text-white/75 hover:bg-white/15 hover:text-white"
    : "text-navy/70 hover:bg-cream hover:text-ink";

  const active = light
    ? "bg-white text-primary shadow-sm"
    : "bg-primary text-white shadow-[0_10px_22px_-12px_rgba(97,150,170,0.9)]";

  const edge = light
    ? "border border-white/30 text-white disabled:opacity-30 hover:enabled:bg-white hover:enabled:text-primary"
    : "border border-navy/15 text-navy disabled:opacity-30 hover:enabled:border-primary hover:enabled:bg-primary hover:enabled:text-white";

  const first = limit ? (page - 1) * limit + 1 : null;
  const last = limit && total ? Math.min(page * limit, total) : null;

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={`${BUTTON} ${edge} disabled:cursor-not-allowed`}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {numbered ? (
          pageWindow(page, totalPages).map((value) =>
            typeof value === "string" ? (
              <span
                key={value}
                aria-hidden="true"
                className={`${BUTTON} ${light ? "text-white/50" : "text-navy/40"}`}
              >
                …
              </span>
            ) : (
              <button
                key={value}
                type="button"
                onClick={() => onChange(value)}
                aria-label={`Page ${value}`}
                aria-current={value === page ? "page" : undefined}
                className={`${BUTTON} ${value === page ? active : idle}`}
              >
                {value}
              </button>
            )
          )
        ) : (
          // No count to draw a window from — say where we are instead.
          <span className={`${BUTTON} ${light ? "text-white/80" : "text-navy/70"}`}>
            Page {page}
          </span>
        )}

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={numbered ? page >= totalPages : !hasNext}
          aria-label="Next page"
          className={`${BUTTON} ${edge} disabled:cursor-not-allowed`}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      {total > 0 && first && first <= total && (
        <p className={`text-xs ${light ? "text-white/70" : "text-navy/55"}`}>
          Showing {first}–{last} of {total}
        </p>
      )}
    </nav>
  );
}
