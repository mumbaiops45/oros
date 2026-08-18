import Image from "next/image";
import Link from "next/link";
import { categoryHref, subcategoryHref } from "@/lib/adapters";
import { ArrowRightIcon } from "@/components/Icons";

/**
 * Full-strength brand colours, one per card position. The image fills the
 * tile and the tone rises from the bottom as a solid scrim behind the caption
 * — the same treatment the home page category rail uses, so a category looks
 * the same wherever it is shown.
 */
const CARD_TONES = [
  { scrim: "from-navy via-navy/70", title: "text-white", body: "text-white/85" },
  { scrim: "from-ink via-ink/70", title: "text-white", body: "text-white/85" },
  { scrim: "from-primary via-primary/70", title: "text-white", body: "text-white/90" },
  { scrim: "from-onyx via-onyx/70", title: "text-white", body: "text-white/85" },
  { scrim: "from-cream via-cream/75", title: "text-ink", body: "text-navy/80" },
  { scrim: "from-navy via-navy/70", title: "text-white", body: "text-white/85" },
];

export const toneAt = (index) => CARD_TONES[index % CARD_TONES.length];

/**
 * A category tile. Clicking it opens the category's subcategory cards.
 *
 * @param {object} props
 * @param {object} props.category  nav shape: { name, slug, blurb, image, subcategories }
 * @param {number} props.index     rotates the brand tone
 */
export function CategoryCard({ category, index = 0 }) {
  const tone = toneAt(index);
  const subcategories = category.subcategories || [];

  return (
    <Link
      href={categoryHref(category)}
      className="group relative block aspect-5/4 overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-28px_rgba(32,57,74,0.7)]"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 92vw"
        className="object-cover transition duration-500 group-hover:scale-105"
      />

      <div className={`absolute inset-0 bg-linear-to-t ${tone.scrim} to-transparent`} />

      {subcategories.length > 0 && (
        <span className="absolute top-4 right-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-navy uppercase backdrop-blur">
          {subcategories.length}{" "}
          {subcategories.length === 1 ? "range" : "ranges"}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <h3 className={`font-display text-lg font-semibold sm:text-xl ${tone.title}`}>
          {category.name}
        </h3>
        {category.blurb && (
          <p className={`mt-1 line-clamp-2 text-[13px] leading-relaxed ${tone.body}`}>
            {category.blurb}
          </p>
        )}
        <span
          className={`mt-3 inline-flex items-center gap-1.5 text-xs font-bold ${tone.title}`}
        >
          Explore
          <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/**
 * A subcategory tile. Clicking it opens that range's products.
 *
 * Lighter than the category tile on purpose — it sits one level deeper, so
 * the image is framed rather than bled and the caption sits on white.
 */
export function SubcategoryCard({ category, subcategory, count }) {
  return (
    <Link
      href={subcategoryHref(category, subcategory)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_22px_45px_-28px_rgba(32,57,74,0.6)]"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-cream">
        <Image
          src={subcategory.image}
          alt={subcategory.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 92vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-primary uppercase">
          {category?.name}
        </p>
        <h3 className="mt-1.5 font-display text-base leading-snug font-semibold text-ink transition group-hover:text-primary">
          {subcategory.name}
        </h3>
        {subcategory.blurb && (
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-navy/65">
            {subcategory.blurb}
          </p>
        )}

        <span className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs font-bold text-primary">
          {count > 0 ? `${count} ${count === 1 ? "print" : "prints"}` : "View prints"}
          <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
