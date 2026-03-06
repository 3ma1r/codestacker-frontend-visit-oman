import type {
  Category,
  Destination,
  RegionKey,
} from "../../types/destination";
import type { PlannerInputs, PlannerResult, StopExplanation } from "../../types/planner";
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

  let dayIndex = 1;
  const days: PlannerResult["days"] = [];

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
      const inputsWithPrefs = { ...inputs, preferredCategories };
      const rawRoute = buildDayRoute(regionDests, ctx, inputsWithPrefs, stats);
      const improvedRoute = twoOptImprove(rawRoute, ctx, totalKmDest, validateDay);
      const dayPlan = scheduleDay(region, improvedRoute);

      const explanations: StopExplanation[] = [];
      const selectedCats = new Set<Category>();
      const currentRoutePoints: Array<{ lat: number; lng: number }> = [];
      for (const stop of improvedRoute) {
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

      days.push({
        dayIndex,
        region,
        routeDestinationIds: improvedRoute.map((stop) => stop.id),
        dayPlan,
        explanations,
      });
      dayIndex += 1;
    }
  }

  const totalKm = days.reduce((sum, day) => sum + day.dayPlan.totalKm, 0);

  return {
    algorithmVersion: ALGORITHM_VERSION,
    inputs,
    regionAllocation: allocation,
    days,
    totalKm,
  };
}

/*
Usage:
const result = buildPlan(destinations, inputs, savedIds);
*/
