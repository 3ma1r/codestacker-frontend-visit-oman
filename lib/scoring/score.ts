import type { Category, Destination, Month } from "../../types/destination";
import type {
  ScoreBreakdown,
  ScoreComponent,
  Weights,
} from "../../types/scoring";
import { detourKm } from "../geo/route";
import {
  detourPenalty,
  diversityGain,
  jaccard,
  seasonFit,
} from "./components";
import { normalizeCost, normalizeCrowd } from "./normalize";

export type ScoreContext = {
  month: Month;
  preferredCategories: Category[];
  stats: import("./normalize").DatasetStats;
  selectedCats: Set<Category>;
  currentRoute: Array<{ lat: number; lng: number }>;
};

const TIE_BREAKER: ScoreComponent[] = [
  "interest",
  "seasonFit",
  "diversity",
  "detour",
  "cost",
  "crowd",
];

export function scoreDestination(
  dest: Destination,
  ctx: ScoreContext,
  weights: Weights,
): ScoreBreakdown {
  const interest = jaccard(dest.categories, ctx.preferredCategories);
  const season = seasonFit(ctx.month, dest.recommended_months);
  const crowd = normalizeCrowd(dest.crowd_level);
  const cost = normalizeCost(dest.ticket_cost_omr, ctx.stats);
  const detour = detourPenalty(
    detourKm(ctx.currentRoute, { lat: dest.lat, lng: dest.lng }),
  );
  const diversity = diversityGain(dest.categories, ctx.selectedCats);

  const total =
    weights.interest * interest +
    weights.seasonFit * season -
    weights.crowd * crowd -
    weights.cost * cost -
    weights.detour * detour +
    weights.diversity * diversity;

  const benefits: Record<ScoreComponent, number> = {
    interest,
    seasonFit: season,
    diversity,
    detour: 1 - detour,
    cost: 1 - cost,
    crowd: 1 - crowd,
  };

  const ranked = [...TIE_BREAKER].sort((a, b) => {
    const diff = weights[b] * benefits[b] - weights[a] * benefits[a];
    if (diff !== 0) {
      return diff;
    }
    return TIE_BREAKER.indexOf(a) - TIE_BREAKER.indexOf(b);
  });

  return {
    total,
    components: {
      interest,
      seasonFit: season,
      crowd,
      cost,
      detour,
      diversity,
    },
    top2: [ranked[0], ranked[1]],
  };
}

/*
Usage:
const breakdown = scoreDestination(dest, ctx, DEFAULT_WEIGHTS);
*/
