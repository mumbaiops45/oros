import Image from "next/image";
import { ArrowRightIcon, SparkIcon, UserIcon } from "@/components/Icons";

const ACCOUNT_PERKS = [
  "200 welcome points on signup",
  "Order tracking & one-tap reorder",
  "Early access to every new batch",
];

export default function DualCta() {
  return (
    <section className="bg-white pb-20 pt-4 lg:pb-28">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:px-15">
        {/* Panel 1 — create an account */}
        <div className="relative overflow-hidden rounded-4xl bg-primary p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.35),transparent_55%)]" />
          <span className="pointer-events-none absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-black/10" />

          <div className="relative flex h-full flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/30">
                <UserIcon className="h-3.5 w-3.5" />
                Members only
              </span>

              <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Make an account, keep the perks
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                One profile for your rituals, refills and reward points — no
                paperwork, no spam.
              </p>

              <ul className="mt-5 space-y-2.5">
                {ACCOUNT_PERKS.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5 text-[13px] text-white/90">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/25 text-[11px] font-bold text-white">
                      ✓
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Create your account
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>

            <Image
              src="/account-illustration.svg"
              alt="OROS member profile"
              width={420}
              height={360}
              className="animate-float-soft w-48 shrink-0 self-center drop-shadow-2xl sm:w-60"
            />
          </div>
        </div>

        {/* Panel 2 — see featured products */}
        <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-50 to-primary/15 p-8 ring-1 ring-slate-100 sm:p-10">
          <span className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full bg-white/70" />

          <div className="relative flex h-full flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                <SparkIcon className="h-3.5 w-3.5" />
                Handpicked edit
              </span>

              <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
                See this season&apos;s featured products
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Twenty-four formulas chosen by our formulators — the ones worth
                clearing shelf space for this month.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <p className="font-display text-2xl font-semibold text-slate-900">24</p>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Featured picks
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-slate-900">Up to 30%</p>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    Bundle savings
                  </p>
                </div>
              </div>

              <a
                href="#products"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                See featured products
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>

            <Image
              src="/featured-illustration.svg"
              alt="Featured OROS products"
              width={420}
              height={360}
              className="animate-float-delay w-48 shrink-0 self-center drop-shadow-2xl sm:w-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
