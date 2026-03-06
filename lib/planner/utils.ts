import type { Destination } from "../../types/destination";
import { totalKm } from "../geo/route";

export function totalKmDest(stops: Destination[]): number {
  return totalKm(stops.map((stop) => ({ lat: stop.lat, lng: stop.lng })));
}
