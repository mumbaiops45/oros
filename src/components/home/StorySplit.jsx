import Image from "next/image";
import { ArrowRightIcon, LeafIcon, ShieldIcon, RecycleIcon } from "@/components/Icons";

const POINTS = [
  {
    icon: LeafIcon,
    title: "Single-origin harvests",
    text: "We buy direct from 240 partner farms — no traders, no blending.",
  },
  {
    icon: ShieldIcon,
    title: "Third-party lab tested",
    text: "Every batch screened for heavy metals, pesticides and microbes.",
  },
  {
    icon: RecycleIcon,
    title: "Refill, don't rebuy",
    text: "Return five empties and your sixth refill is on the house.",
  },
];

export default function StorySplit() {
  return (
    <section id="story" className="bg-white py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-15 lg:gap-16">
        {/* Left — copy */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            From our farm to your shelf
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-[42px]">
            Nine years of doing the slow, unglamorous work
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
            OROS started in 2016 with one cold-press and a stubborn belief: if a
            formula needs a disclaimer, it needs a rewrite. We still press in
            batches of 400 bottles, still bottle within 72 hours of harvest, and
            still publish the full ingredient origin on every carton.
          </p>

          <ul className="mt-8 space-y-5">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Read our story
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </div>

        {/* Right — tinted panel with the transparent shot floating in its middle */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[36px] bg-primary px-6 py-14 sm:px-10">
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_85%,rgba(0,0,0,0.22),transparent_60%)]" />
            <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20" />
            <span className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-black/10" />
            <span className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />

            <Image
              src="/story-collection.svg"
              alt="The OROS botanical collection"
              width={520}
              height={460}
              className="animate-float-soft relative mx-auto w-full max-w-md drop-shadow-2xl"
            />
          </div>

          <div className="absolute -bottom-6 left-4 rounded-2xl bg-white px-5 py-4 shadow-xl sm:left-8">
            <p className="font-display text-2xl font-semibold text-slate-900">240+</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">
              Partner farms
            </p>
          </div>
          <div className="absolute -top-5 right-4 rounded-2xl bg-white px-5 py-4 shadow-xl sm:right-8">
            <p className="font-display text-2xl font-semibold text-slate-900">72 hrs</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">
              Harvest to bottle
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
