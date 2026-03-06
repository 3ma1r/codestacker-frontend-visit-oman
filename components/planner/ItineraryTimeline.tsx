import type { Locale } from "../../lib/i18n/locale";
import type { PlannerResult } from "../../types/planner";
import type { Destination } from "../../types/destination";
import { tName } from "../../lib/i18n/strings";
import { componentLabel } from "../../lib/scoring/labels";

type Props = {
  day: PlannerResult["days"][number] | undefined;
  destinationsById: Map<string, Destination>;
  locale: Locale;
};

export default function ItineraryTimeline({ day, destinationsById, locale }: Props) {
  if (!day) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
        No day selected.
      </div>
    );
  }

  if (day.dayPlan.stops.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
        No stops scheduled for this day.
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
        return (
          <div
            key={stop.destinationId}
            className="rounded-xl border border-zinc-200 bg-white p-4"
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
                Travel: {stop.travelKmFromPrev.toFixed(1)} km (
                {stop.travelMinutesFromPrev} min) · Visit {stop.visitMinutes} min
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
