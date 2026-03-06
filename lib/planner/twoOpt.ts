import type { Destination } from "../../types/destination";
import type { DayContext } from "./validate";
import { validateDay } from "./validate";

export function twoOptImprove(
  route: Destination[],
  ctx: DayContext,
  totalKmFn: (stops: Destination[]) => number,
  validateFn: typeof validateDay,
): Destination[] {
  if (route.length < 4) {
    return route;
  }

  let best = [...route];
  let bestDistance = totalKmFn(best);

  for (let i = 0; i < best.length - 2; i += 1) {
    for (let j = i + 1; j < best.length - 1; j += 1) {
      const candidate = [
        ...best.slice(0, i),
        ...best.slice(i, j + 1).reverse(),
        ...best.slice(j + 1),
      ];
      const distance = totalKmFn(candidate);
      if (distance < bestDistance) {
        const validation = validateFn(candidate, ctx, totalKmFn);
        if (validation.ok) {
          best = candidate;
          bestDistance = distance;
        }
      }
    }
  }

  return best;
}

/*
Usage:
const improved = twoOptImprove(route, ctx, totalKmDest, validateDay);
*/
