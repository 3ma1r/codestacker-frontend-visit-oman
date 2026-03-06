import type { Category, Destination, RegionKey } from "../../types/destination";
import type { Intensity } from "../../types/planner";

export type DayContext = {
  intensity: Intensity;
  dayRegion: RegionKey;
  userPreferredCategories: Category[];
};

export type ValidationResult =
  | { ok: true }
  | { ok: false; reasons: string[] };

export function maxStops(intensity: Intensity): number {
  switch (intensity) {
    case "relaxed":
      return 3;
    case "balanced":
      return 4;
    case "packed":
      return 5;
    default:
      return 4;
  }
}

export function totalVisitMinutes(stops: Destination[]): number {
  return stops.reduce(
    (total, stop) => total + stop.avg_visit_duration_minutes,
    0,
  );
}

export function regionConsistent(
  stops: Destination[],
  dayRegion: RegionKey,
): boolean {
  return stops.every((stop) => stop.regionKey === dayRegion);
}

export function categoryVarietyOk(
  stops: Destination[],
  userPreferredCategories: Category[],
): boolean {
  if (userPreferredCategories.length === 1) {
    return true;
  }

  const counts = new Map<string, number>();
  for (const stop of stops) {
    const primary = [...stop.categories].sort()[0];
    counts.set(primary, (counts.get(primary) ?? 0) + 1);
  }

  for (const count of counts.values()) {
    if (count > 2) {
      return false;
    }
  }

  return true;
}

export function restGapOk(stops: Destination[]): boolean {
  if (stops.length < 2) {
    return true;
  }

  for (let i = 0; i < stops.length - 1; i += 1) {
    const current = stops[i].avg_visit_duration_minutes;
    const next = stops[i + 1].avg_visit_duration_minutes;
    const currentLong = current > 90;
    const nextLong = next > 90;
    if (currentLong && nextLong) {
      return false;
    }
  }

  return true;
}

export function validateDay(
  stops: Destination[],
  ctx: DayContext,
  totalKmFn: (stops: Destination[]) => number,
): ValidationResult {
  const reasons: string[] = [];

  if (stops.length > maxStops(ctx.intensity)) {
    reasons.push("Too many stops for selected intensity.");
  }
  if (!regionConsistent(stops, ctx.dayRegion)) {
    reasons.push("Stops are not all in the day region.");
  }
  if (totalVisitMinutes(stops) > 480) {
    reasons.push("Total visit time exceeds 8 hours.");
  }
  if (totalKmFn(stops) > 250) {
    reasons.push("Total driving distance exceeds 250 km.");
  }
  if (!categoryVarietyOk(stops, ctx.userPreferredCategories)) {
    reasons.push("Category variety limit exceeded.");
  }
  if (!restGapOk(stops)) {
    reasons.push("Rest gap rule violated for long stops.");
  }

  if (reasons.length > 0) {
    return { ok: false, reasons };
  }

  return { ok: true };
}

/*
Usage:
const result = validateDay(stops, ctx, (dayStops) =>
  totalKm(dayStops.map((stop) => ({ lat: stop.lat, lng: stop.lng }))),
);
*/
