import type {
  Category,
  Destination,
  RegionKey,
} from "../../types/destination";
import type { PlannerInputs, RegionAllocation } from "../../types/planner";
import type { Weights } from "../../types/scoring";
import type { DatasetStats } from "../scoring/normalize";
import { scoreDestination } from "../scoring/score";
import { DEFAULT_WEIGHTS } from "../scoring/weights";

export const REGION_ORDER: RegionKey[] = [
  "muscat",
  "dakhiliya",
  "sharqiya",
  "dhofar",
  "batinah",
  "dhahira",
];

type AllocationCandidate = {
  daysByRegion: number[];
  score: number;
};

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

function groupByRegion(destinations: Destination[]): Map<RegionKey, Destination[]> {
  const map = new Map<RegionKey, Destination[]>();
  for (const region of REGION_ORDER) {
    map.set(region, []);
  }
  for (const destination of destinations) {
    const list = map.get(destination.regionKey);
    if (list) {
      list.push(destination);
    }
  }
  return map;
}

function computeRegionUtilities(
  destinationsByRegion: Map<RegionKey, Destination[]>,
  inputs: PlannerInputs,
  preferredCategories: Category[],
  stats: DatasetStats,
  maxDaysPerRegion: number,
  weights: Weights,
): Map<RegionKey, number> {
  const utilities = new Map<RegionKey, number>();

  for (const region of REGION_ORDER) {
    const destinations = destinationsByRegion.get(region) ?? [];
    const scored = destinations
      .map((destination) => {
        const breakdown = scoreDestination(
          destination,
          {
            month: inputs.month,
            preferredCategories,
            stats,
            selectedCats: new Set<Category>(),
            currentRoute: [],
          },
          weights,
        );
        return { id: destination.id, total: breakdown.total };
      })
      .sort((a, b) => {
        if (a.total !== b.total) {
          return b.total - a.total;
        }
        return a.id.localeCompare(b.id);
      });

    const limit = Math.min(maxDaysPerRegion, 5, scored.length);
    let sum = 0;
    for (let i = 0; i < limit; i += 1) {
      sum += scored[i].total;
    }
    utilities.set(region, sum);
  }

  return utilities;
}

function enumerateAllocations(
  totalDays: number,
  maxPerRegion: number,
  minRegions: number,
): number[][] {
  const results: number[][] = [];
  const current = Array(REGION_ORDER.length).fill(0);

  function dfs(index: number, remaining: number) {
    if (index === REGION_ORDER.length) {
      if (remaining === 0) {
        const usedRegions = current.filter((days) => days > 0).length;
        if (usedRegions >= minRegions) {
          results.push([...current]);
        }
      }
      return;
    }

    const maxForThis = Math.min(maxPerRegion, remaining);
    for (let days = 0; days <= maxForThis; days += 1) {
      current[index] = days;
      dfs(index + 1, remaining - days);
    }
  }

  dfs(0, totalDays);
  return results;
}

function allocationScore(
  daysByRegion: number[],
  regionUtilities: Map<RegionKey, number>,
): number {
  let total = 0;
  for (let i = 0; i < REGION_ORDER.length; i += 1) {
    const region = REGION_ORDER[i];
    const utility = regionUtilities.get(region) ?? 0;
    total += utility * daysByRegion[i];
  }
  return total;
}

function isLexicographicallyEarlier(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return a[i] > b[i];
    }
  }
  return false;
}

function orderAllocations(
  allocation: number[],
  regionUtilities: Map<RegionKey, number>,
): RegionAllocation[] {
  const entries = REGION_ORDER.map((region, index) => ({
    region,
    days: allocation[index],
    utility: regionUtilities.get(region) ?? 0,
  })).filter((entry) => entry.days > 0);

  entries.sort((a, b) => {
    if (a.utility !== b.utility) {
      return b.utility - a.utility;
    }
    return REGION_ORDER.indexOf(a.region) - REGION_ORDER.indexOf(b.region);
  });

  return entries.map((entry) => ({ region: entry.region, days: entry.days }));
}

export function allocateRegions(
  destinations: Destination[],
  inputs: PlannerInputs,
  savedInterestIds: string[],
  stats: DatasetStats,
  weights: Weights = DEFAULT_WEIGHTS,
): RegionAllocation[] {
  const byId = new Map(destinations.map((destination) => [destination.id, destination]));
  const savedDestinations = savedInterestIds
    .map((id) => byId.get(id))
    .filter((destination): destination is Destination => Boolean(destination));

  const preferredCategories = derivePreferredCategories(inputs, savedDestinations);
  const destinationsByRegion = groupByRegion(destinations);
  const maxPerRegion = Math.ceil(inputs.days / 2);

  const regionUtilities = computeRegionUtilities(
    destinationsByRegion,
    inputs,
    preferredCategories,
    stats,
    maxPerRegion,
    weights,
  );

  const minRegions = inputs.days >= 3 ? 2 : 1;
  const allocations = enumerateAllocations(inputs.days, maxPerRegion, minRegions);

  let best: AllocationCandidate | null = null;
  for (const allocation of allocations) {
    const score = allocationScore(allocation, regionUtilities);
    if (!best) {
      best = { daysByRegion: allocation, score };
      continue;
    }
    if (score > best.score) {
      best = { daysByRegion: allocation, score };
      continue;
    }
    if (score === best.score && isLexicographicallyEarlier(allocation, best.daysByRegion)) {
      best = { daysByRegion: allocation, score };
    }
  }

  if (!best) {
    return [];
  }

  return orderAllocations(best.daysByRegion, regionUtilities);
}

/*
Usage:
const allocations = allocateRegions(destinations, inputs, savedIds, stats);
*/
