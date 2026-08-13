import Image from "next/image";
import { ArrowRightIcon, BoxesIcon, UserIcon } from "@/components/Icons";

const ACCOUNT_PERKS = [
  "Your uploaded STL files kept on file",
  "Live print status & one-tap reprint",
  "Saved colours, materials and quantities",
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
                Make an account, keep your models
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                One profile for your designs, print jobs and reorders — no
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
              alt="An OROS account dashboard with saved 3D models and print progress"
              width={420}
              height={360}
              className="animate-float-soft w-48 shrink-0 self-center drop-shadow-2xl sm:w-60"
            />
          </div>
        </div>

        {/* Panel 2 — see featured products */}
        <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-cream to-primary/20 p-8 ring-1 ring-navy/10 sm:p-10">
          <span className="pointer-events-none absolute -right-14 -top-14 h-52 w-52 rounded-full bg-white/70" />

          <div className="relative flex h-full flex-col gap-8 sm:flex-row sm:items-center">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                <BoxesIcon className="h-3.5 w-3.5" />
                Bulk &amp; corporate
              </span>

              <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                Ordering for an event, a team or a shop?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-navy/80">
                Tell us the design and the count. Batch pricing kicks in from the
                tenth unit and we quote within six working hours.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <p className="font-display text-2xl font-semibold text-ink">10 pcs</p>
                  <p className="text-[11px] uppercase tracking-wide text-navy/65">
                    Minimum order qty
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-ink">Up to 35%</p>
                  <p className="text-[11px] uppercase tracking-wide text-navy/65">
                    Batch savings
                  </p>
                </div>
              </div>

              <a
                href="#custom"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Get a bulk quote
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>

            <Image
              src="/featured-illustration.svg"
              alt="A batch of identical 3D printed products with a bulk discount tag"
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
