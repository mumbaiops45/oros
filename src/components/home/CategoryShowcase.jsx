import Image from "next/image";
import { categories } from "@/data/catalog";
import { ArrowRightIcon } from "@/components/Icons";

// Colourful card palette — one per category, kept local to this section.
const CARD_TONES = [
  "from-rose-100 to-rose-50",
  "from-amber-100 to-amber-50",
  "from-emerald-100 to-emerald-50",
  "from-lime-100 to-lime-50",
  "from-sky-100 to-sky-50",
  "from-violet-100 to-violet-50",
];

export default function CategoryShowcase() {
  return (
    <section id="categories" className="bg-white pb-16 pt-6 lg:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Shop by category
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Find your ritual
            </h2>
          </div>
          <a
            href="#products"
            className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-primary sm:self-auto"
          >
            Browse all categories
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, i) => (
            <li key={category.slug}>
              <a
                href="#products"
                className={`group relative flex h-full flex-col items-center overflow-hidden rounded-3xl bg-linear-to-b ${CARD_TONES[i % CARD_TONES.length]} p-5 text-center transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-30px_rgba(15,23,42,0.6)]`}
              >
                <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/60" />
                <span className="pointer-events-none absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-white/40" />

                <div className="relative flex h-32 items-center justify-center">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={140}
                    height={140}
                    className="h-28 w-auto drop-shadow-lg transition duration-500 group-hover:scale-110"
                  />
                </div>

                <h3 className="relative mt-3 font-display text-[15px] font-semibold text-slate-900">
                  {category.name}
                </h3>
                <p className="relative mt-1.5 text-[11px] leading-relaxed text-slate-600">
                  {category.blurb}
                </p>
                <span className="relative mt-3 text-[11px] font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                  Shop now →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
