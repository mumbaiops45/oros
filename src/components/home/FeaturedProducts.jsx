import { featuredProducts } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";
import { ArrowRightIcon } from "@/components/Icons";

export default function FeaturedProducts() {
  return (
    <section id="products" className="bg-slate-50/70 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Our favourites
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
            Loved in 62,000 bathrooms
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            The formulas our customers reorder most — every one of them free from
            parabens, sulphates and synthetic fragrance.
          </p>
        </div>

        {/* Two rows of four on desktop */}
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {featuredProducts.map((product, i) => (
            <li key={product.slug}>
              <ProductCard product={product} index={i} />
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            View more products
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
