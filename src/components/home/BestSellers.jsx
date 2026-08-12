import { bestSellers } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { ArrowRightIcon, SparkIcon } from "@/components/Icons";

export default function BestSellers() {
  return (
    <section id="bestsellers" className="relative overflow-hidden bg-primary py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(255,255,255,0.4),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_88%,rgba(0,0,0,0.22),transparent_52%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/30">
              <SparkIcon className="h-3.5 w-3.5" />
              This month&apos;s best sellers
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
              Restocked twice this month
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              These five sold out in under 40 hours the last time. Grab them
              before the next batch goes live.
            </p>
          </div>

          <a
            href="#"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:shadow-xl sm:self-auto"
          >
            Shop best sellers
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
          {bestSellers.map((product, i) => (
            <li key={product.slug}>
              <ProductCard product={product} index={i} onDark />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
