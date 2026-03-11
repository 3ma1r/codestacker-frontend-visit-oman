"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Destination, Locale } from "../../types/destination";
import { tName, tRegion } from "../../lib/i18n/strings";

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"] as const;

type Props = {
  destination: Destination;
  locale: Locale;
  onRemove: (id: string) => void;
  allDestinations: Destination[];
};

export default function SavedFeaturedCard({
  destination,
  locale,
  onRemove,
  allDestinations,
}: Props) {
  const imageQueue = useMemo(() => {
    const sameNameIds = allDestinations
      .filter((item) => item.name.en === destination.name.en)
      .map((item) => item.id);
    const uniqueIds = Array.from(
      new Set([destination.id, ...sameNameIds]),
    );
    return uniqueIds.flatMap((id) =>
      IMAGE_EXTS.map((ext) => `/images/destinations/${id}${ext}`),
    );
  }, [allDestinations, destination.id, destination.name.en]);

  const [imageIndex, setImageIndex] = useState(0);
  const imgSrc = imageQueue[imageIndex] ?? "/globe.svg";

  return (
    <Link
      href={`/${locale}/destinations/${destination.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/60 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5"
    >
      <div className="relative h-60 w-full">
        <img
          src={imgSrc}
          alt={tName(destination, locale)}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          onError={() => {
            setImageIndex((index) =>
              imageQueue[index + 1] ? index + 1 : index,
            );
          }}
        />
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove(destination.id);
          }}
          className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 shadow transition hover:bg-white"
        >
          {locale === "ar" ? "إزالة" : "Remove"}
        </button>
      </div>

      <div className="bg-white/70 p-4 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {tName(destination, locale)}
            </h3>
            <p className="text-xs text-neutral-500">
              {tRegion(destination, locale)}
            </p>
          </div>
          <div className="text-xs font-semibold text-neutral-900">
            {destination.ticket_cost_omr === 0
              ? "Free"
              : `${destination.ticket_cost_omr.toFixed(2)} OMR`}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {destination.categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
