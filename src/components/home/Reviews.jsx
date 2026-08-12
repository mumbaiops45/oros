import { reviews } from "@/data/catalog";
import { PlayIcon, StarIcon } from "@/components/Icons";

export default function Reviews() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-15">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            #PrintedWithOROS
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
            Unboxings filmed by real customers
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            Unedited 60-second clips from makers, cosplayers and product teams who
            paid with their own money. Tap any story to watch the full build.
          </p>
        </div>

        {/* Reels rail — each reel sits inside a phone-shaped card */}
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 sm:mx-0 sm:px-0">
          {reviews.map((review) => (
            <li key={review.name} className="w-[268px] shrink-0 snap-start sm:w-[280px]">
              <div className="group">
                {/* Phone mockup */}
                <div className="relative aspect-[9/16] overflow-hidden rounded-[2.25rem] border-[6px] border-slate-900 bg-slate-900 shadow-[0_28px_60px_-30px_rgba(15,23,42,0.75)] transition duration-300 group-hover:-translate-y-2">
                  <div className={`absolute inset-0 bg-linear-to-br ${review.tone}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.5),transparent_55%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/80 via-black/35 to-transparent" />

                  {/* Notch */}
                  <span className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900" />

                  {/* Progress ticks */}
                  <div className="absolute inset-x-4 top-9 flex gap-1">
                    <span className="h-0.5 flex-1 rounded-full bg-white/90" />
                    <span className="h-0.5 flex-1 rounded-full bg-white/35" />
                    <span className="h-0.5 flex-1 rounded-full bg-white/35" />
                  </div>

                  {/* Play affordance */}
                  <button
                    type="button"
                    aria-label={`Play ${review.name}'s unboxing clip`}
                    className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur transition group-hover:scale-110 group-hover:bg-white/40"
                  >
                    <PlayIcon className="ml-0.5 h-6 w-6" />
                  </button>

                  <span className="absolute right-3 top-9 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                    {review.views} views
                  </span>

                  {/* Caption */}
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-primary">
                        {review.name.charAt(0)}
                      </span>
                      <div className="leading-tight">
                        <p className="text-[13px] font-semibold">{review.name}</p>
                        <p className="text-[10px] text-white/70">
                          {review.handle} · {review.city}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-[13px] font-semibold leading-snug">
                      {review.title}
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium backdrop-blur">
                      {review.product}
                    </span>
                  </div>
                </div>

                {/* Written review under the phone */}
                <div className="mt-4 px-1">
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="h-3.5 w-3.5" filled={i < review.rating} />
                    ))}
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-2 text-center text-xs text-slate-400 sm:hidden">
          Swipe to see more stories →
        </p>
      </div>
    </section>
  );
}
