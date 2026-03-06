import { haversineDistance } from "./haversine";

type Point = { lat: number; lng: number };

export function totalKm(route: Point[]): number {
  if (route.length < 2) {
    return 0;
  }

  let total = 0;
  for (let i = 0; i < route.length - 1; i += 1) {
    total += haversineDistance(route[i], route[i + 1]);
  }
  return total;
}

export function detourKm(route: Point[], candidate: Point): number {
  if (route.length === 0) {
    return 0;
  }
  if (route.length === 1) {
    return haversineDistance(route[0], candidate);
  }

  let minAdded = Math.min(
    haversineDistance(candidate, route[0]),
    haversineDistance(route[route.length - 1], candidate),
  );

  for (let i = 0; i < route.length - 1; i += 1) {
    const current = route[i];
    const next = route[i + 1];
    const added =
      haversineDistance(current, candidate) +
      haversineDistance(candidate, next) -
      haversineDistance(current, next);
    if (added < minAdded) {
      minAdded = added;
    }
  }

  return Math.max(0, minAdded);
}

/*
Usage:
const km = totalKm([{ lat: 23.5, lng: 58.4 }, { lat: 23.6, lng: 58.5 }]);
const extra = detourKm([{ lat: 23.5, lng: 58.4 }], { lat: 23.55, lng: 58.45 });
*/
