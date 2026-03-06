import type { Weights } from "../../types/scoring";

export const DEFAULT_WEIGHTS: Weights = {
  interest: 0.3,
  seasonFit: 0.2,
  detour: 0.18,
  cost: 0.14,
  crowd: 0.1,
  diversity: 0.08,
};
