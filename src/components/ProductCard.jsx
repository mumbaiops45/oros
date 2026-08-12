import Image from "next/image";
import { formatPrice } from "@/data/catalog";
import { BagIcon, HeartIcon, StarIcon } from "@/components/Icons";

const THUMB_TONES = [
  "bg-rose-50",
  "bg-amber-50",
  "bg-emerald-50",
  "bg-sky-50",
  "bg-violet-50",
  "bg-lime-50",
];

/**
 * @param {object} props
 * @param {object} props.product
 * @param {number} props.index    used to rotate the pastel thumbnail tint
 * @param {boolean} props.onDark  card sits on the vibrant primary band
 */
export default function ProductCard({ product, index = 0, onDark = false }) {
  const tone = THUMB_TONES[index % THUMB_TONES.length];

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl transition duration-300 ${
        onDark
          ? "bg-white shadow-[0_18px_45px_-25px_rgba(15,23,42,0.6)] hover:-translate-y-1.5"
          : "border border-slate-100 bg-white hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_22px_45px_-28px_rgba(15,23,42,0.55)]"
      }`}
    >
      <div className={`relative flex items-center justify-center p-5 ${onDark ? "bg-slate-50" : tone}`}>
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              product.badge === "Bestseller"
                ? "bg-primary text-white"
                : product.badge === "New"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-primary shadow-sm"
            }`}
          >
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-primary hover:text-white"
        >
          <HeartIcon className="h-4 w-4" />
        </button>

        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="h-40 w-auto transition duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
          {product.category}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-1.5">
          <StarIcon className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-slate-700">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <span className="text-base font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
            <span className="ml-1.5 text-xs text-slate-400 line-through">
              {formatPrice(product.mrp)}
            </span>
          </div>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white"
          >
            <BagIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
