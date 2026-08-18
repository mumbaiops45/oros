import Link from "next/link";

/**
 * The band every browse page opens with: breadcrumb trail, eyebrow, title and
 * blurb. Kept in one component so /categories, a category and a subcategory
 * page all sit on the same rhythm — the header is fixed, hence the top pad.
 *
 * @param {object} props
 * @param {Array<{label: string, href?: string}>} props.trail
 *        last entry is the current page and renders unlinked
 */
export default function CatalogHeader({
  eyebrow,
  title,
  blurb,
  trail = [],
  count,
  children,
}) {
  return (
    <div className="border-b border-navy/10 bg-cream">
      <div className="mx-auto max-w-7xl px-5 pt-32 pb-10 sm:px-8 lg:px-15 lg:pt-36">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs text-navy/55"
        >
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          {trail.map((crumb, index) => (
            <span key={crumb.href || crumb.label} className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              {crumb.href && index < trail.length - 1 ? (
                <Link href={crumb.href} className="transition hover:text-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-navy/80">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-3 font-display text-3xl leading-tight font-semibold text-ink sm:text-4xl">
              {title}
            </h1>
            {blurb && (
              <p className="mt-3 text-sm leading-relaxed text-navy/75 sm:text-base">
                {blurb}
              </p>
            )}
          </div>

          {count > 0 && (
            <p className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy/70 shadow-sm">
              {count} {count === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
