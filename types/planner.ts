import type { Category, Month } from "./destination";

export type BudgetTier = "low" | "medium" | "luxury";
export type Intensity = "relaxed" | "balanced" | "packed";

export type PlannerInputs = {
  days: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  month: Month;
  budget: BudgetTier;
  intensity: Intensity;
  preferredCategories: Category[];
};

export type RegionAllocation = {
  region: import("./destination").RegionKey;
  days: number;
};

export type PlannedStop = {
  destinationId: string;
  order: number;
  travelKmFromPrev: number;
  travelMinutesFromPrev: number;
  visitMinutes: number;
  startTime: string;
  endTime: string;
};

export type DayPlan = {
  region: import("./destination").RegionKey;
  stops: PlannedStop[];
  totalKm: number;
  totalVisitMinutes: number;
};

export type StopExplanation = {
  destinationId: string;
  top2: import("./scoring").ScoreComponent[];
};

export type PlannerResult = {
  algorithmVersion: string;
  inputs: PlannerInputs;
  regionAllocation: RegionAllocation[];
  days: Array<{
    dayIndex: number;
    region: import("./destination").RegionKey;
    routeDestinationIds: string[];
    dayPlan: DayPlan;
    explanations: StopExplanation[];
  }>;
  totalKm: number;
};
