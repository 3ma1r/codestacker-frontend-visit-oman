"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Locale } from "../../lib/i18n/locale";
import type { PlannerResult } from "../../types/planner";
import type { Destination } from "../../types/destination";
import { tName } from "../../lib/i18n/strings";
import { componentLabel } from "../../lib/scoring/labels";

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"] as const;

type Props = {
  day: PlannerResult["days"][number] | undefined;
  destinationsById: Map<string, Destination>;
  allDestinations: Destination[];
  locale: Locale;
  activeStopIndex: number;
  onSelectStop: (index: number) => void;
  dayTabs?: ReactNode;
};

function Thumbnail({
  destination,
  allDestinations,
  label,
}: {
  destination: Destination;
  allDestinations: Destination[];
  label: string;
}) {
  const imageQueue = useMemo(() => {
    const sameNameIds = allDestinations
      .filter((item) => item.name.en === destination.name.en)
      .map((item) => item.id);
    const uniqueIds = Array.from(new Set([destination.id, ...sameNameIds]));
    return uniqueIds.flatMap((id) =>
      IMAGE_EXTS.map((ext) => `/images/destinations/${id}${ext}`),
    );
  }, [allDestinations, destination.id, destination.name.en]);

  const [imageIndex, setImageIndex] = useState(0);
  const src = imageQueue[imageIndex] ?? "/globe.svg";

  return (
    <img
      src={src}
      alt={label}
      className="h-14 w-14 rounded-2xl object-cover shadow-sm"
      onError={() =>
        setImageIndex((index) =>
          imageQueue[index + 1] ? index + 1 : index,
        )
      }
    />
  );
}

export default function ItineraryTimeline({
  day,
  destinationsById,
  allDestinations,
  locale,
  activeStopIndex,
  onSelectStop,
  dayTabs,
}: Props) {
  const isArabic = locale === "ar";
  if (!day) {
    return (
      <div className="rounded-2xl border border-dashed border-white/50 bg-white/60 p-5 text-sm text-zinc-500 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-zinc-900">
            {isArabic ? "مسار اليوم" : "Journey timeline"}
          </div>
        </div>
        {dayTabs ? <div className="mt-3">{dayTabs}</div> : null}
        <div className="mt-4">{isArabic ? "لم يتم اختيار يوم." : "No day selected."}</div>
      </div>
    );
  }

  if (day.dayPlan.stops.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/50 bg-white/60 p-5 text-sm text-zinc-500 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-zinc-900">
            {isArabic ? "مسار اليوم" : "Journey timeline"}
          </div>
          <div className="text-xs text-zinc-500">
            {isArabic ? "اليوم" : "Day"} {day.dayIndex}
          </div>
        </div>
        {dayTabs ? <div className="mt-3">{dayTabs}</div> : null}
        <div className="mt-4">
          {isArabic ? "لا توجد محطات لهذا اليوم." : "No stops scheduled for this day."}
        </div>
      </div>
    );
  }

  const explanations = new Map(
    day.explanations.map((item) => [item.destinationId, item.top2]),
  );

  return (
    <div className="space-y-4 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-900">
          {isArabic ? "مسار اليوم" : "Journey timeline"}
        </div>
        <div className="text-xs text-zinc-500">
          {isArabic ? "اليوم" : "Day"} {day.dayIndex}
        </div>
      </div>
      {dayTabs ? <div>{dayTabs}</div> : null}

      <div className="space-y-3">
        {day.dayPlan.stops.map((stop) => {
        const destination = destinationsById.get(stop.destinationId);
        const top2 = explanations.get(stop.destinationId) ?? [];
        const isActive = stop.order - 1 === activeStopIndex;
        return (
          <div
            key={stop.destinationId}
            className={[
              "cursor-pointer rounded-2xl border bg-white/80 p-4 transition shadow-sm",
              isActive
                ? "border-emerald-300 bg-emerald-50/70"
                : "border-white/60",
            ].join(" ")}
            onClick={() => onSelectStop(stop.order - 1)}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {destination ? (
                  <Thumbnail
                    destination={destination}
                    allDestinations={allDestinations}
                    label={tName(destination, locale)}
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-xs text-zinc-500">
                    {stop.order}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {destination ? tName(destination, locale) : stop.destinationId}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {stop.startTime} – {stop.endTime}
                  </div>
                </div>
              </div>
              <div className="text-xs text-zinc-500">
                {isArabic ? "المسافة" : "Travel"}: {stop.travelKmFromPrev.toFixed(1)}{" "}
                {isArabic ? "كم" : "km"} ({stop.travelMinutesFromPrev}{" "}
                {isArabic ? "د" : "min"}) · {isArabic ? "الزيارة" : "Visit"}{" "}
                {stop.visitMinutes} {isArabic ? "د" : "min"}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {top2.length === 0 ? (
                <span className="text-xs text-zinc-400">—</span>
              ) : (
                top2.map((component) => (
                  <span
                    key={component}
                    className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] text-zinc-600 shadow-sm"
                  >
                    {componentLabel(component, locale)}
                  </span>
                ))
              )}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
