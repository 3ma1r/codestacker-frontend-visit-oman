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

  useEffect(() => {
    if (storedInputs) {
      setFormValue(storedInputs);
    }
  }, [storedInputs]);

  useEffect(() => {
    if (storedResult) {
      setResult(storedResult);
      setSelectedDay(1);
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

  return (
    <div className="space-y-8">
      <TripForm
        value={formValue}
        availableCategories={availableCategories}
        onChange={setFormValue}
        onSubmit={handleSubmit}
      />

      {result ? (
        <div className="space-y-6">
          <RegionAllocationSummary allocation={result.regionAllocation} />

          <DayTabs
            days={result.days.length}
            selectedDay={selectedDay}
            onSelect={setSelectedDay}
          />

          <ItineraryTimeline
            day={selectedDayPlan}
            destinationsById={destinationsById}
            locale={locale}
          />

          <CostBreakdownCard
            cost={result.cost}
            inputs={result.inputs}
            overBudgetBy={result.overBudgetBy}
            adjustments={result.adjustments}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          Generate a plan to see the itinerary, costs, and explanations.
        </div>
      )}
    </div>
  );
}
