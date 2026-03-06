import type { Category, Destination } from "../../types/destination";
import type { PlannerInputs } from "../../types/planner";
import type { Weights } from "../../types/scoring";
import type { DatasetStats } from "../scoring/normalize";
import { totalKm } from "../geo/route";
import { scoreDestination } from "../scoring/score";
import { DEFAULT_WEIGHTS } from "../scoring/weights";
import { maxStops, validateDay, type DayContext } from "./validate";

type Point = { lat: number; lng: number };

function sharesPreferredCategory(
  destination: Destination,
  preferredCategories: Category[],
): boolean {
  if (preferredCategories.length === 0) {
    return false;
  }
  return destination.categories.some((category) =>
    preferredCategories.includes(category),
  );
}

function totalKmDestinations(stops: Destination[]): number {
  const points = stops.map((stop) => ({ lat: stop.lat, lng: stop.lng }));
  return totalKm(points);
}

function bestInsertion(
  selected: Destination[],
  candidate: Destination,
): Destination[] {
  if (selected.length === 0) {
    return [candidate];
  }

  let bestRoute = [candidate, ...selected];
  let bestDistance = totalKmDestinations(bestRoute);

  for (let i = 1; i <= selected.length; i += 1) {
    const proposed = [
      ...selected.slice(0, i),
      candidate,
      ...selected.slice(i),
    ];
    const distance = totalKmDestinations(proposed);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestRoute = proposed;
    }
  }

  return bestRoute;
}

export function buildDayRoute(
  regionDests: Destination[],
  ctx: DayContext,
  inputs: PlannerInputs,
  stats: DatasetStats,
  weights: Weights = DEFAULT_WEIGHTS,
): Destination[] {
  const candidates = regionDests.filter(
    (destination) => destination.regionKey === ctx.dayRegion,
  );

  const preferredCategories =
    inputs.preferredCategories.length > 0
      ? inputs.preferredCategories
      : ctx.userPreferredCategories;

  let remaining = [...candidates];
  const selected: Destination[] = [];
  const selectedCats = new Set<Category>();
  let currentRoutePoints: Point[] = [];

  while (selected.length < maxStops(ctx.intensity) && remaining.length > 0) {
    const ranked = remaining
      .map((candidate) => {
        const breakdown = scoreDestination(
          candidate,
          {
            month: inputs.month,
            preferredCategories,
            stats,
            selectedCats,
            currentRoute: currentRoutePoints,
          },
          weights,
        );
        const bonus =
          preferredCategories.length > 0 &&
          sharesPreferredCategory(candidate, preferredCategories)
            ? 0.02
            : 0;
        const priority = breakdown.total + bonus;
        return { candidate, breakdown, priority };
      })
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        if (a.breakdown.components.seasonFit !== b.breakdown.components.seasonFit) {
          return b.breakdown.components.seasonFit - a.breakdown.components.seasonFit;
        }
        if (a.breakdown.components.interest !== b.breakdown.components.interest) {
          return b.breakdown.components.interest - a.breakdown.components.interest;
        }
        if (a.breakdown.components.detour !== b.breakdown.components.detour) {
          return a.breakdown.components.detour - b.breakdown.components.detour;
        }
        return a.candidate.id.localeCompare(b.candidate.id);
      });

    let accepted = false;
    for (const rankedCandidate of ranked) {
      const proposal = bestInsertion(selected, rankedCandidate.candidate);
      const validation = validateDay(proposal, ctx, totalKmDestinations);
      if (validation.ok) {
        selected.splice(0, selected.length, ...proposal);
        selectedCats.clear();
        for (const stop of selected) {
          stop.categories.forEach((category) => selectedCats.add(category));
        }
        currentRoutePoints = selected.map((stop) => ({
          lat: stop.lat,
          lng: stop.lng,
        }));
        remaining = remaining.filter(
          (candidate) => candidate.id !== rankedCandidate.candidate.id,
        );
        accepted = true;
        break;
      }
    }

    if (!accepted) {
      break;
    }
  }

  return selected;
}

/*
Usage:
const route = buildDayRoute(regionDestinations, ctx, inputs, stats);
*/
