import type { Destination, RegionKey } from "../../types/destination";
import type { DayPlan, PlannedStop } from "../../types/planner";
import { haversineDistance } from "../geo/haversine";

export const DEFAULT_DAY_START = "09:00";
// Assumption: fixed average driving speed for all routes.
export const ASSUMED_SPEED_KMH = 70;

export function kmToMinutes(km: number, speedKmh = ASSUMED_SPEED_KMH): number {
  if (speedKmh <= 0) {
    return 0;
  }
  return Math.ceil((km / speedKmh) * 60);
}

export function addMinutesHHMM(hhmm: string, minutes: number): string {
  const [hh, mm] = hhmm.split(":").map(Number);
  const total = (hh * 60 + mm + minutes) % (24 * 60);
  const safeTotal = total < 0 ? total + 24 * 60 : total;
  const nextHours = Math.floor(safeTotal / 60);
  const nextMinutes = safeTotal % 60;
  return `${String(nextHours).padStart(2, "0")}:${String(nextMinutes).padStart(
    2,
    "0",
  )}`;
}

export function scheduleDay(
  region: RegionKey,
  route: Destination[],
  startTimeHHMM = DEFAULT_DAY_START,
): DayPlan {
  const stops: PlannedStop[] = [];
  let currentTime = startTimeHHMM;
  let totalKm = 0;
  let totalVisitMinutes = 0;

  for (let i = 0; i < route.length; i += 1) {
    const stop = route[i];
    const prev = route[i - 1];
    const travelKmFromPrev = prev
      ? haversineDistance(
          { lat: prev.lat, lng: prev.lng },
          { lat: stop.lat, lng: stop.lng },
        )
      : 0;
    const travelMinutesFromPrev = kmToMinutes(travelKmFromPrev);
    const startTime = addMinutesHHMM(currentTime, travelMinutesFromPrev);
    const endTime = addMinutesHHMM(
      startTime,
      stop.avg_visit_duration_minutes,
    );

    stops.push({
      destinationId: stop.id,
      order: i + 1,
      travelKmFromPrev,
      travelMinutesFromPrev,
      visitMinutes: stop.avg_visit_duration_minutes,
      startTime,
      endTime,
    });

    currentTime = endTime;
    totalKm += travelKmFromPrev;
    totalVisitMinutes += stop.avg_visit_duration_minutes;
  }

  return {
    region,
    stops,
    totalKm,
    totalVisitMinutes,
  };
}

/*
Usage:
const plan = scheduleDay("muscat", route);
*/
