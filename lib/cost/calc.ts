import type { Destination } from "../../types/destination";
import type {
  BudgetTier,
  CostBreakdown,
  DayPlan,
  PlannerInputs,
} from "../../types/planner";

export const FOOD_OMR_PER_DAY = 6;

export const HOTEL_OMR_PER_NIGHT: Record<BudgetTier, number> = {
  low: 20,
  medium: 45,
  luxury: 90,
};

// Assumption: fixed fuel cost per kilometer.
export const FUEL_OMR_PER_KM = 0.03;

export function budgetThreshold(tier: BudgetTier, days: number): number {
  switch (tier) {
    case "low":
      return 60 * days;
    case "medium":
      return 110 * days;
    case "luxury":
      return 200 * days;
    default:
      return 110 * days;
  }
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeCost(
  plannedDays: DayPlan[],
  routeDestinationsByDay: Destination[][],
  inputs: PlannerInputs,
): CostBreakdown {
  const daysCount = plannedDays.length;
  const nights = Math.max(0, daysCount - 1);

  const food = FOOD_OMR_PER_DAY * daysCount;
  const hotel = HOTEL_OMR_PER_NIGHT[inputs.budget] * nights;
  const fuel = FUEL_OMR_PER_KM * plannedDays.reduce((sum, day) => sum + day.totalKm, 0);

  let tickets = 0;
  for (const dayDestinations of routeDestinationsByDay) {
    for (const destination of dayDestinations) {
      tickets += destination.ticket_cost_omr;
    }
  }

  const total = fuel + tickets + food + hotel;

  return {
    fuel: round2(fuel),
    tickets: round2(tickets),
    food: round2(food),
    hotel: round2(hotel),
    total: round2(total),
  };
}

/*
Usage:
const costs = computeCost(plannedDays, routeDestinationsByDay, inputs);
*/
