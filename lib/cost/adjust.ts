import type { Destination, RegionKey } from "../../types/destination";
import type { PlannerInputs, DayPlan } from "../../types/planner";
import { budgetThreshold, computeCost } from "./calc";
import { totalKmDest } from "../planner/utils";
import { validateDay } from "../planner/validate";

export type AdjustmentResult = {
  adjustedRoutes: Destination[][];
  adjustments: string[];
};

function sharesCategory(a: Destination, b: Destination): boolean {
  return a.categories.some((category) => b.categories.includes(category));
}

function buildCostDays(
  plannedDays: DayPlan[],
  routes: Destination[][],
): DayPlan[] {
  return plannedDays.map((day, index) => ({
    ...day,
    totalKm: totalKmDest(routes[index] ?? []),
  }));
}

export function applyBudgetAdjustments(
  destinationsByDay: Destination[][],
  inputs: PlannerInputs,
  thresholdsFn: typeof budgetThreshold,
  computeCostFn: typeof computeCost,
  plannedDays: DayPlan[],
  allRegionDestsByKey: Record<RegionKey, Destination[]>,
  validateFn: typeof validateDay,
): AdjustmentResult {
  const adjustments: string[] = [];
  const routes = destinationsByDay.map((day) => [...day]);

  const threshold = thresholdsFn(inputs.budget, plannedDays.length);
  const costDays = buildCostDays(plannedDays, routes);
  let cost = computeCostFn(costDays, routes, inputs);

  if (cost.total <= threshold) {
    return { adjustedRoutes: routes, adjustments };
  }

  for (let dayIndex = 0; dayIndex < routes.length; dayIndex += 1) {
    const route = routes[dayIndex];
    const dayRegion = plannedDays[dayIndex].region;
    const ctx = {
      intensity: inputs.intensity,
      dayRegion,
      userPreferredCategories: inputs.preferredCategories,
    };

    const paidStops = route
      .map((stop, index) => ({ stop, index }))
      .filter(({ stop }) => stop.ticket_cost_omr > 0)
      .sort((a, b) => {
        if (a.stop.ticket_cost_omr !== b.stop.ticket_cost_omr) {
          return b.stop.ticket_cost_omr - a.stop.ticket_cost_omr;
        }
        return a.stop.id.localeCompare(b.stop.id);
      });

    for (const { stop: candidateToReplace, index } of paidStops) {
      const replacements = (allRegionDestsByKey[dayRegion] ?? [])
        .filter((candidate) => candidate.id !== candidateToReplace.id)
        .filter((candidate) => !route.some((existing) => existing.id === candidate.id))
        .filter(
          (candidate) =>
            candidate.ticket_cost_omr <= candidateToReplace.ticket_cost_omr,
        )
        .filter((candidate) => sharesCategory(candidate, candidateToReplace))
        .sort((a, b) => {
          if (a.ticket_cost_omr !== b.ticket_cost_omr) {
            return a.ticket_cost_omr - b.ticket_cost_omr;
          }
          if (a.crowd_level !== b.crowd_level) {
            return a.crowd_level - b.crowd_level;
          }
          return a.id.localeCompare(b.id);
        });

      for (const replacement of replacements) {
        const newRoute = [...route];
        newRoute[index] = replacement;
        const validation = validateFn(newRoute, ctx, totalKmDest);
        if (validation.ok) {
          routes[dayIndex] = newRoute;
          adjustments.push(
            `Day ${dayIndex + 1}: swapped ${candidateToReplace.id} for ${replacement.id} to reduce ticket cost`,
          );
          const updatedCostDays = buildCostDays(plannedDays, routes);
          cost = computeCostFn(updatedCostDays, routes, inputs);
          if (cost.total <= threshold) {
            return { adjustedRoutes: routes, adjustments };
          }
          break;
        }
      }
    }
  }

  for (let dayIndex = 0; dayIndex < routes.length; dayIndex += 1) {
    const route = routes[dayIndex];
    if (route.length <= 1) {
      continue;
    }
    const dayRegion = plannedDays[dayIndex].region;
    const ctx = {
      intensity: inputs.intensity,
      dayRegion,
      userPreferredCategories: inputs.preferredCategories,
    };

    const paidStops = route
      .map((stop, index) => ({ stop, index }))
      .filter(({ stop }) => stop.ticket_cost_omr > 0)
      .sort((a, b) => {
        if (a.stop.ticket_cost_omr !== b.stop.ticket_cost_omr) {
          return b.stop.ticket_cost_omr - a.stop.ticket_cost_omr;
        }
        return a.stop.id.localeCompare(b.stop.id);
      });

    if (paidStops.length === 0) {
      continue;
    }

    const { stop: toRemove, index } = paidStops[0];
    const newRoute = route.filter((_, idx) => idx !== index);
    const validation = validateFn(newRoute, ctx, totalKmDest);
    if (validation.ok) {
      routes[dayIndex] = newRoute;
      adjustments.push(
        `Day ${dayIndex + 1}: removed ${toRemove.id} to meet budget`,
      );
      const updatedCostDays = buildCostDays(plannedDays, routes);
      cost = computeCostFn(updatedCostDays, routes, inputs);
      if (cost.total <= threshold) {
        return { adjustedRoutes: routes, adjustments };
      }
    }
  }

  return { adjustedRoutes: routes, adjustments };
}

/*
Usage:
const { adjustedRoutes, adjustments } = applyBudgetAdjustments(
  routesByDay,
  inputs,
  budgetThreshold,
  computeCost,
  plannedDays,
  allRegionDestsByKey,
  validateDay,
);
*/
