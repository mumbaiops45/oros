import Image from "next/image";
import Link from "next/link";
import { formatMoq, formatPrice } from "@/data/catalog";
import { productHref } from "@/lib/adapters";
import { BagIcon, BoxesIcon, HeartIcon, StarIcon } from "@/components/Icons";

/**
 * Thumbnail backgrounds rotate through the full brand palette — every card in
 * a grid lands on a different one. `dark` flips the chips/buttons that sit on
 * top of the tone to their light-on-dark variant.
 */
const THUMB_TONES = [
  { bg: "bg-cream", dark: false },
  { bg: "bg-ink", dark: true },
  { bg: "bg-primary", dark: true },
  { bg: "bg-navy", dark: true },
  { bg: "bg-onyx", dark: true },
];

/**
 * @param {object} props
 * @param {object} props.product
 * @param {number} props.index    used to rotate the brand thumbnail tone
 */
export default function ProductCard({ product, index = 0 }) {
  const tone = THUMB_TONES[index % THUMB_TONES.length];
  const onTone = tone.dark;
  const moq = product.moq ?? 1;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_22px_45px_-28px_rgba(32,57,74,0.6)]">
      <div className={`relative flex items-center justify-center p-1.5 ${tone.bg}`}>
        {/* Soft stage light so the product still reads on the near-black tones */}
        {onTone && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(255,255,255,0.18),transparent_62%)]" />
        )}

        {product.badge && (
          <span
            className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              product.badge === "Bestseller"
                ? onTone
                  ? "bg-white text-navy"
                  : "bg-primary text-white"
                : product.badge === "New"
                  ? onTone
                    ? "bg-white/20 text-white ring-1 ring-white/45 backdrop-blur"
                    : "bg-ink text-white"
                  : onTone
                    ? "bg-white/90 text-navy"
                    : "bg-white text-primary shadow-sm"
            }`}
          >
            {product.badge}
          </span>
        )}

        {product.custom && (
          <span
            className={`absolute bottom-3 left-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${
              onTone ? "bg-white/20 ring-1 ring-white/35 backdrop-blur" : "bg-ink/85"
            }`}
          >
            Customisable
          </span>
        )}

        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm transition group-hover:opacity-100 ${
            onTone
              ? "text-navy hover:bg-white hover:text-primary"
              : "text-primary hover:bg-primary hover:text-white"
          }`}
        >
          <HeartIcon className="h-4 w-4" />
        </button>

        <Image
          src={product.image}
          alt={product.imageAlt || product.name}
          width={200}
          height={200}
          className="relative h-44 w-full rounded-[10px] object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
          {product.category}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-ink">
          {/* Stretched link — the whole card is the click target, and the
              buttons above sit on a higher layer to stay reachable. */}
          <Link
            href={productHref(product)}
            className="transition after:absolute after:inset-0 after:z-[1] group-hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>

{/* Ratings and material are not columns the API stores, so the row
            only appears for records that carry them. */}
        {(product.rating || product.material) && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.rating && (
              <>
                <StarIcon className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-navy">
                  {product.rating}
                </span>
                <span className="text-xs text-navy/50">({product.reviews})</span>
              </>
            )}
            {product.material && (
              <span className="ml-auto rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold text-navy/70">
                {product.material}
              </span>
            )}
          </div>
        )}

        {/* Minimum order quantity — shown on every card */}
        <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-1.5">
          <BoxesIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="text-[11px] font-semibold text-primary">
            MOQ {formatMoq(moq)}
          </span>
          <span className="truncate text-[11px] text-navy/55">
            {product.custom ? "· made to order" : moq > 1 ? "· sold in packs" : "· ready to ship"}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <span className="text-base font-bold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.mrp && (
              <span className="ml-1.5 text-xs text-navy/45 line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white"
          >
            <BagIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
