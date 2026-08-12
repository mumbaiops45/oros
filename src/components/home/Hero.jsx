import Image from "next/image";
import { ArrowRightIcon, BoxesIcon, CubeIcon, StarIcon } from "@/components/Icons";

const STATS = [
  { value: "180,000+", label: "Parts printed" },
  { value: "4.9 / 5", label: "Average rating" },
  { value: "0.08 mm", label: "Layer precision" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary pb-32 pt-36 sm:pt-40 lg:pb-44 lg:pt-48">
      {/* Ambient light — built only from white/black over the primary */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.42),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(255,255,255,0.28),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_100%,rgba(0,0,0,0.16),transparent_55%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:px-15 lg:gap-8">
        {/* Left — copy */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/30 backdrop-blur">
            <CubeIcon className="h-4 w-4" />
            Designed &amp; 3D printed in India
          </span>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            Objects worth
            <br className="hidden sm:block" /> printing, made{" "}
            <span className="relative inline-block">
              <span className="relative z-10">your way</span>
              <span className="absolute inset-x-0 -bottom-1 z-0 h-1.5 rounded-full bg-white/55" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/90 lg:mx-0 lg:text-lg">
            Shop hundreds of ready-to-ship 3D printed vases, gadgets, figurines
            and functional parts — or send us your own design and we will print
            it in the colour, size and quantity you need.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#products"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
            >
              Shop the collection
              <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#custom"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/50 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15 sm:w-auto"
            >
              <BoxesIcon className="h-4 w-4" />
              Custom &amp; bulk order
            </a>
          </div>

          <dl className="mx-auto mt-11 grid max-w-lg grid-cols-3 gap-4 border-t border-white/25 pt-7 lg:mx-0">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-xl font-semibold text-white sm:text-2xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-[11px] uppercase tracking-wide text-white/70">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right — floating transparent product shot */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />

          <Image
            src="/hero-printer.svg"
            alt="An OROS 3D printer laying down the final layers of a spiral vase"
            width={560}
            height={620}
            priority
            className="animate-float relative mx-auto w-full drop-shadow-2xl"
          />

          {/* Floating trust chips */}
          <div className="animate-float-soft absolute -left-2 top-10 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-xl sm:left-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <StarIcon className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold text-slate-900">4.9 / 5</p>
              <p className="text-[10px] text-slate-500">12,480 reviews</p>
            </div>
          </div>

          {/* MOQ is surfaced right in the hero, not buried in a policy page */}
          <div className="animate-float-delay absolute -right-1 bottom-12 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-xl sm:right-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BoxesIcon className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-bold text-slate-900">Bulk from 10 pcs</p>
              <p className="text-[10px] text-slate-500">Save up to 35%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Irregular curved lower boundary */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 leading-[0]">
        <svg
          viewBox="0 0 1440 130"
          preserveAspectRatio="none"
          className="h-[60px] w-full sm:h-[90px] lg:h-[120px]"
          aria-hidden="true"
        >
          <path
            d="M0,58 C118,112 232,16 352,34 C470,52 566,124 706,112 C832,101 928,22 1058,14 C1178,7 1318,64 1440,40 L1440,130 L0,130 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}
