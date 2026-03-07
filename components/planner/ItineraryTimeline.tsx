import type { Locale } from "../../lib/i18n/locale";
import type { PlannerResult } from "../../types/planner";
import type { Destination } from "../../types/destination";
import { tName } from "../../lib/i18n/strings";
import { componentLabel } from "../../lib/scoring/labels";

type Props = {
  day: PlannerResult["days"][number] | undefined;
  destinationsById: Map<string, Destination>;
  locale: Locale;
  activeStopIndex: number;
  onSelectStop: (index: number) => void;
};

export default function ItineraryTimeline({
  day,
  destinationsById,
  locale,
  activeStopIndex,
  onSelectStop,
}: Props) {
  const isArabic = locale === "ar";
  if (!day) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
        {isArabic ? "لم يتم اختيار يوم." : "No day selected."}
      </div>
    );
  }

  if (day.dayPlan.stops.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
        {isArabic ? "لا توجد محطات لهذا اليوم." : "No stops scheduled for this day."}
      </div>
    );
  }

  const explanations = new Map(
    day.explanations.map((item) => [item.destinationId, item.top2]),
  );

  return (
    <div className="space-y-3">
      {day.dayPlan.stops.map((stop) => {
        const destination = destinationsById.get(stop.destinationId);
        const top2 = explanations.get(stop.destinationId) ?? [];
        const isActive = stop.order - 1 === activeStopIndex;
        return (
          <div
            key={stop.destinationId}
            className={[
              "cursor-pointer rounded-xl border bg-white p-4 transition",
              isActive ? "border-emerald-400 bg-emerald-50" : "border-zinc-200",
            ].join(" ")}
            onClick={() => onSelectStop(stop.order - 1)}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  {destination ? tName(destination, locale) : stop.destinationId}
                </div>
                <div className="text-xs text-zinc-500">
                  {stop.startTime} – {stop.endTime}
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
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
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
  );
}
