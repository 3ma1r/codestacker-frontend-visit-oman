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

  return (
    <div className="space-y-8">
      <TripForm
        value={formValue}
        availableCategories={availableCategories}
        onChange={setFormValue}
        onSubmit={handleSubmit}
        locale={locale}
      />

      {result ? (
        <div className="space-y-6">
          <RegionAllocationSummary allocation={result.regionAllocation} locale={locale} />

          <DayTabs
            days={result.days.length}
            selectedDay={selectedDay}
            onSelect={(day) => {
              setSelectedDay(day);
              setActiveStopIndex(0);
            }}
            locale={locale}
          />

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <ItineraryTimeline
              day={selectedDayPlan}
              destinationsById={destinationsById}
              locale={locale}
              activeStopIndex={activeStopIndex}
              onSelectStop={setActiveStopIndex}
            />
            <TripMap
              locale={locale}
              stops={stopsForMap}
              activeStopIndex={activeStopIndex}
              onActiveStopChange={setActiveStopIndex}
            />
          </div>

          <CostBreakdownCard
            cost={result.cost}
            inputs={result.inputs}
            overBudgetBy={result.overBudgetBy}
            adjustments={result.adjustments}
            locale={locale}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}
