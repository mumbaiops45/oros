import { benefits } from "@/data/catalog";
import { benefitIcons } from "@/components/Icons";

export default function Benefits() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Why OROS
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
            Good for you, gentler on the planet
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Five promises we have kept on every single batch since 2016 — audited
            and printed on the back of every bottle.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {benefits.map((benefit) => {
            const Icon = benefitIcons[benefit.icon];
            return (
              <li key={benefit.title} className="group text-center">
                <div className="relative mx-auto mb-5 h-24 w-24">
                  <span className="animate-pulse-ring absolute inset-0 rounded-full bg-primary/25" />
                  <span className="absolute inset-0 rounded-full border border-dashed border-primary/35" />
                  <span className="absolute inset-[7px] flex items-center justify-center rounded-full bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-9 w-9" />
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-[13px] leading-relaxed text-slate-500">
                  {benefit.text}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
