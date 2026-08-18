"use client";

/** The spec rows the admin panel attached to this product. */
export default function ProductSpecs({ specs = [] }) {
  if (specs.length === 0) return null;

  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border border-navy/10 bg-navy/10 sm:grid-cols-2">
      {specs.map((spec) => (
        <div key={spec._id} className="bg-white px-5 py-4">
          <dt className="text-[11px] font-semibold tracking-[0.12em] text-navy/55 uppercase">
            {spec.label}
          </dt>
          <dd className="mt-1 text-sm font-semibold text-ink">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
