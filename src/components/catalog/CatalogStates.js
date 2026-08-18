import Link from "next/link";

/** Placeholder tiles in the shape of whatever grid is still loading. */
export function CardSkeleton({ count = 8, className = "h-80" }) {
  return Array.from({ length: count }, (_, index) => (
    <li
      key={index}
      className={`${className} animate-pulse rounded-2xl border border-navy/10 bg-cream`}
    />
  ));
}

/**
 * An empty grid is the normal state of a catalogue nobody has filled in yet,
 * so it reads as information rather than as a failure.
 */
export function EmptyState({ title, blurb, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-navy/20 bg-white px-6 py-16 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {blurb && (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-navy/65">
          {blurb}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

/** A failed fetch, with the API's own message and a way back out. */
export function ErrorState({ error, onRetry }) {
  return (
    <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 px-6 py-16 text-center">
      <p className="font-display text-lg font-semibold text-ink">
        That didn&apos;t load
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-navy/70">
        {error}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex rounded-full border-2 border-primary px-6 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
        >
          Try again
        </button>
      )}
    </div>
  );
}
