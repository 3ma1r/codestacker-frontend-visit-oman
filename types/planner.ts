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
