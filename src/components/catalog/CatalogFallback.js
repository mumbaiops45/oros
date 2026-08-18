import { CardSkeleton } from "./CatalogStates";

/**
 * What a browse route shows while its client half boots. Every browse page
 * reads the query string, which opts it out of prerendering — this is the
 * Suspense fallback that keeps the layout from collapsing in the meantime.
 */
export default function CatalogFallback({ count = 8 }) {
  return (
    <>
      <div className="border-b border-navy/10 bg-cream">
        <div className="mx-auto max-w-7xl px-5 pt-32 pb-10 sm:px-8 lg:px-15 lg:pt-36">
          <div className="h-3 w-40 animate-pulse rounded-full bg-white" />
          <div className="mt-6 h-9 w-80 max-w-full animate-pulse rounded-xl bg-white" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-full bg-white" />
        </div>
      </div>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
          <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            <CardSkeleton count={count} />
          </ul>
        </div>
      </section>
    </>
  );
}
