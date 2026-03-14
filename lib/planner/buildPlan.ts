import type {
  Category,
  Destination,
  RegionKey,
} from "../../types/destination";
import type {
  PlannerInputs,
  PlannerResult,
  StopExplanation,
  DayPlan,
} from "../../types/planner";
import { applyBudgetAdjustments } from "../cost/adjust";
import { budgetThreshold, computeCost } from "../cost/calc";
import { computeStats } from "../scoring/normalize";
import { DEFAULT_WEIGHTS } from "../scoring/weights";
import { scoreDestination } from "../scoring/score";
import { allocateRegions } from "./allocateRegions";
import { buildDayRoute } from "./buildDay";
import { scheduleDay } from "./schedule";
import { twoOptImprove } from "./twoOpt";
import { validateDay, type DayContext } from "./validate";
import { totalKmDest } from "./utils";

export const ALGORITHM_VERSION = "v1.0";

function derivePreferredCategories(
  inputs: PlannerInputs,
  savedDestinations: Destination[],
): Category[] {
  if (inputs.preferredCategories.length > 0) {
    return inputs.preferredCategories;
  }
  const unique = new Set<Category>();
  for (const destination of savedDestinations) {
    destination.categories.forEach((category) => unique.add(category));
  }
  return Array.from(unique).sort();
}

export function buildPlan(
  destinations: Destination[],
  inputs: PlannerInputs,
  savedInterestIds: string[],
): PlannerResult {
  const stats = computeStats(destinations);
  const allocation = allocateRegions(destinations, inputs, savedInterestIds, stats);
  const byId = new Map(destinations.map((destination) => [destination.id, destination]));
  const savedDestinations = savedInterestIds
    .map((id) => byId.get(id))
    .filter((destination): destination is Destination => Boolean(destination));
  const preferredCategories = derivePreferredCategories(inputs, savedDestinations);
  const inputsWithPrefs = { ...inputs, preferredCategories };

  const allRegionDestsByKey = destinations.reduce<Record<RegionKey, Destination[]>>(
    (acc, destination) => {
      acc[destination.regionKey].push(destination);
      return acc;
    },
    {
      muscat: [],
      dakhiliya: [],
      sharqiya: [],
      dhofar: [],
      batinah: [],
      dhahira: [],
    },
  );

  let dayIndex = 1;
  const days: PlannerResult["days"] = [];
  const routesByDay: Destination[][] = [];
  const dayPlans: DayPlan[] = [];
  const usedIds = new Set<string>();

  const buildExplanations = (route: Destination[]) => {
    const explanations: StopExplanation[] = [];
    const selectedCats = new Set<Category>();
    const currentRoutePoints: Array<{ lat: number; lng: number }> = [];
    for (const stop of route) {
      const breakdown = scoreDestination(
        stop,
        {
          month: inputs.month,
          preferredCategories,
          stats,
          selectedCats,
          currentRoute: currentRoutePoints,
        },
        DEFAULT_WEIGHTS,
      );
      explanations.push({ destinationId: stop.id, top2: breakdown.top2 });
      stop.categories.forEach((category) => selectedCats.add(category));
      currentRoutePoints.push({ lat: stop.lat, lng: stop.lng });
    }
    return explanations;
  };

  for (const block of allocation) {
    const region = block.region;
    const regionDests = destinations.filter(
      (destination) => destination.regionKey === region,
    );
    for (let i = 0; i < block.days; i += 1) {
      const ctx: DayContext = {
        intensity: inputs.intensity,
        dayRegion: region,
        userPreferredCategories: preferredCategories,
      };
      let rawRoute = buildDayRoute(
        regionDests,
        ctx,
        inputsWithPrefs,
        stats,
        undefined,
        usedIds,
      );
      if (rawRoute.length === 0) {
        rawRoute = buildDayRoute(regionDests, ctx, inputsWithPrefs, stats);
      }
      const improvedRoute = twoOptImprove(rawRoute, ctx, totalKmDest, validateDay);
      const dayPlan = scheduleDay(region, improvedRoute);
      const explanations = buildExplanations(improvedRoute);

      days.push({
        dayIndex,
        region,
        routeDestinationIds: improvedRoute.map((stop) => stop.id),
        dayPlan,
        explanations,
      });
      routesByDay.push(improvedRoute);
      dayPlans.push(dayPlan);
      improvedRoute.forEach((stop) => usedIds.add(stop.id));
      dayIndex += 1;
    }
  }

  const { adjustedRoutes, adjustments } = applyBudgetAdjustments(
    routesByDay,
    inputsWithPrefs,
    budgetThreshold,
    computeCost,
    dayPlans,
    allRegionDestsByKey,
    validateDay,
  );

  let finalDays = days;
  let finalDayPlans = dayPlans;
  if (adjustments.length > 0) {
    finalDays = days.map((day, index) => {
      const updatedRoute = adjustedRoutes[index] ?? [];
      const updatedDayPlan = scheduleDay(day.region, updatedRoute);
      return {
        ...day,
        routeDestinationIds: updatedRoute.map((stop) => stop.id),
        dayPlan: updatedDayPlan,
        explanations: buildExplanations(updatedRoute),
      };
    });
    finalDayPlans = finalDays.map((day) => day.dayPlan);
  }

  const finalCost = computeCost(finalDayPlans, adjustedRoutes, inputsWithPrefs);
  const threshold = budgetThreshold(inputs.budget, finalDayPlans.length);
  const overBudgetBy = Math.max(0, finalCost.total - threshold);

  const totalKm = finalDays.reduce((sum, day) => sum + day.dayPlan.totalKm, 0);

  return {
    algorithmVersion: ALGORITHM_VERSION,
    inputs,
    regionAllocation: allocation,
    days: finalDays,
    totalKm,
    cost: finalCost,
    overBudgetBy,
    adjustments,
  };
}

/*
Usage:
const result = buildPlan(destinations, inputs, savedIds);
*/
