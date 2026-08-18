"use client";

import { useState } from "react";
import Image from "next/image";
import { PRODUCT_IMAGE_FALLBACK } from "@/lib/adapters";

/**
 * Media comes back sorted with the primary asset first, so index 0 is the
 * shot the admin panel marked as the hero. A product with no media at all
 * falls back to the placeholder rather than a broken frame.
 */
export default function ProductGallery({ media = [], name }) {
  const [active, setActive] = useState(0);

  const items = media.length
    ? media
    : [{ _id: "fallback", type: "IMAGE", url: PRODUCT_IMAGE_FALLBACK, altText: name }];

  const current = items[Math.min(active, items.length - 1)];

  return (
    <div className="lg:sticky lg:top-32">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-navy/10 bg-cream">
        {current.type === "VIDEO" ? (
          <video
            key={current._id}
            src={current.url}
            poster={current.posterUrl || undefined}
            controls
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            key={current._id}
            src={current.url}
            alt={current.altText || name}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
            className="object-cover"
          />
        )}
      </div>

      {items.length > 1 && (
        <ul className="mt-4 grid grid-cols-5 gap-3">
          {items.map((item, index) => (
            <li key={item._id}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`View image ${index + 1} of ${items.length}`}
                aria-current={index === active}
                className={`relative aspect-square w-full overflow-hidden rounded-xl border-2 bg-cream transition ${
                  index === active
                    ? "border-primary"
                    : "border-transparent hover:border-primary/40"
                }`}
              >
                <Image
                  src={item.type === "VIDEO" ? item.posterUrl || PRODUCT_IMAGE_FALLBACK : item.url}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                {item.type === "VIDEO" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/35 text-xs font-bold text-white">
                    ▶
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
