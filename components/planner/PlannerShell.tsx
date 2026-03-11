"use client";

import { useMemo, useState, useEffect } from "react";
import type { Locale } from "../../lib/i18n/locale";
import type { Category, Destination } from "../../types/destination";
import type { PlannerInputs } from "../../types/planner";
import { loadDestinations } from "../../lib/data/load";
import { buildPlan } from "../../lib/planner/buildPlan";
import { useAppStore } from "../../store/useAppStore";
import TripForm from "./TripForm";
import RegionAllocationSummary from "./RegionAllocationSummary";
import DayTabs from "./DayTabs";
import ItineraryTimeline from "./ItineraryTimeline";
import CostBreakdownCard from "./CostBreakdownCard";
import dynamic from "next/dynamic";
import { tName } from "../../lib/i18n/strings";

const TripMap = dynamic(() => import("./TripMap"), { ssr: false });

type Props = {
  locale: Locale;
};

function deriveCategoriesFromSaved(
  savedDestinations: Destination[],
): Category[] {
  const unique = new Set<Category>();
  for (const destination of savedDestinations) {
    destination.categories.forEach((category) => unique.add(category));
  }
  return Array.from(unique).sort();
}

export default function PlannerShell({ locale }: Props) {
  const destinations = useMemo(() => loadDestinations(), []);
  const destinationsById = useMemo(
    () => new Map(destinations.map((destination) => [destination.id, destination])),
    [destinations],
  );

  const savedInterests = useAppStore((state) => state.savedInterests);
  const storedInputs = useAppStore((state) => state.plannerInputs);
  const storedResult = useAppStore((state) => state.plannerResult);
  const setPlannerInputs = useAppStore((state) => state.setPlannerInputs);
  const setPlannerResult = useAppStore((state) => state.setPlannerResult);

  const savedDestinations = useMemo(
    () =>
      savedInterests
        .map((id) => destinationsById.get(id))
        .filter((destination): destination is Destination => Boolean(destination)),
    [savedInterests, destinationsById],
  );

  const defaultInputs: PlannerInputs = useMemo(
    () => ({
      days: 3,
      month: 1,
      budget: "medium",
      intensity: "balanced",
      preferredCategories: deriveCategoriesFromSaved(savedDestinations),
    }),
    [savedDestinations],
  );

  const [formValue, setFormValue] = useState<PlannerInputs>(
    storedInputs ?? defaultInputs,
  );
  const [result, setResult] = useState(storedResult);
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  useEffect(() => {
    if (storedInputs) {
      setFormValue(storedInputs);
    }
  }, [storedInputs]);

  useEffect(() => {
    if (storedResult) {
      setResult(storedResult);
      setSelectedDay(1);
      setActiveStopIndex(0);
    }
  }, [storedResult]);

  const availableCategories = useMemo(() => {
    const unique = new Set<Category>();
    destinations.forEach((destination) =>
      destination.categories.forEach((category) => unique.add(category)),
    );
    return Array.from(unique).sort();
  }, [destinations]);

  const handleSubmit = (inputs: PlannerInputs) => {
    const plan = buildPlan(destinations, inputs, savedInterests);
    setPlannerInputs(inputs);
    setPlannerResult(plan);
    setResult(plan);
    setSelectedDay(1);
  };

  const selectedDayPlan = result?.days.find((day) => day.dayIndex === selectedDay);
  const stopsForMap =
    selectedDayPlan?.routeDestinationIds
      .map((id) => destinationsById.get(id))
      .filter((destination): destination is Destination => Boolean(destination))
      .map((destination) => ({
        id: destination.id,
        name: tName(destination, locale),
        lat: destination.lat,
        lng: destination.lng,
      })) ?? [];

  const isArabic = locale === "ar";
  const emptyLabel = isArabic
    ? "أنشئ خطة لعرض المسار والتكاليف والتفسيرات."
    : "Generate a plan to see the itinerary, costs, and explanations.";

  const totalStops =
    result?.days.reduce((sum, day) => sum + day.dayPlan.stops.length, 0) ?? 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.05fr,2fr]">
        <div className="space-y-6">
          <div className="relative -mt-16">
            <TripForm
              value={formValue}
              availableCategories={availableCategories}
              onChange={setFormValue}
              onSubmit={handleSubmit}
              locale={locale}
            />
          </div>

          {result && (
            <div className="grid justify-items-center gap-3 text-zinc-600 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex w-full max-w-[170px] flex-col items-center justify-center gap-1 rounded-2xl border border-black/50 px-2.5 py-2 text-center transition hover:-translate-y-0.5 hover:border-black/80 active:translate-y-0 active:border-black">
                <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                  {isArabic ? "الأيام" : "Trip length"}
                </div>
                <div className="text-base font-semibold text-zinc-900">
                  {result.inputs.days} {isArabic ? "أيام" : "days"}
                </div>
              </div>
              <div className="flex w-full max-w-[170px] flex-col items-center justify-center gap-1 rounded-2xl border border-black/50 px-2.5 py-2 text-center transition hover:-translate-y-0.5 hover:border-black/80 active:translate-y-0 active:border-black">
                <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                  {isArabic ? "الوجهات" : "Places"}
                </div>
                <div className="text-base font-semibold text-zinc-900">
                  {totalStops}
                </div>
              </div>
              <div className="flex w-full max-w-[170px] flex-col items-center justify-center gap-1 rounded-2xl border border-black/50 px-2.5 py-2 text-center transition hover:-translate-y-0.5 hover:border-black/80 active:translate-y-0 active:border-black">
                <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                  {isArabic ? "المسافة" : "Distance"}
                </div>
                <div className="text-base font-semibold text-zinc-900">
                  {result.totalKm.toFixed(1)} {isArabic ? "كم" : "km"}
                </div>
              </div>
              <div className="flex w-full max-w-[170px] flex-col items-center justify-center gap-1 rounded-2xl border border-black/50 px-2.5 py-2 text-center transition hover:-translate-y-0.5 hover:border-black/80 active:translate-y-0 active:border-black">
                <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                  {isArabic ? "الميزانية" : "Budget"}
                </div>
                <div
                  className={[
                    "text-base font-semibold",
                    result.overBudgetBy > 0
                      ? "text-rose-600"
                      : "text-emerald-600",
                  ].join(" ")}
                >
                  {result.overBudgetBy > 0
                    ? isArabic
                      ? "تجاوز"
                      : "Over"
                    : isArabic
                      ? "ضمن"
                      : "Within"}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {result ? (
            <div className="space-y-6">
              <div className="grid gap-6 grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] items-stretch">
                <div className="min-w-0">
                  <ItineraryTimeline
                    day={selectedDayPlan}
                    destinationsById={destinationsById}
                    allDestinations={destinations}
                    locale={locale}
                    activeStopIndex={activeStopIndex}
                    onSelectStop={setActiveStopIndex}
                    className="h-full"
                    dayTabs={
                      <DayTabs
                        days={result.days.length}
                        selectedDay={selectedDay}
                        onSelect={(day) => {
                          setSelectedDay(day);
                          setActiveStopIndex(0);
                        }}
                        locale={locale}
                      />
                    }
                  />
                </div>
                <div className="min-w-0 h-full">
                  <TripMap
                    locale={locale}
                    stops={stopsForMap}
                    allDestinations={destinations}
                    activeStopIndex={activeStopIndex}
                    onActiveStopChange={setActiveStopIndex}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
                <CostBreakdownCard
                  cost={result.cost}
                  inputs={result.inputs}
                  overBudgetBy={result.overBudgetBy}
                  adjustments={result.adjustments}
                  locale={locale}
                  className="h-full"
                />
                <RegionAllocationSummary
                  allocation={result.regionAllocation}
                  locale={locale}
                  className="h-full"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/40 bg-white/60 p-6 text-sm text-zinc-600 shadow-sm">
              {emptyLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
