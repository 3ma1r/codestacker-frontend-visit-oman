import type { Destination, Month } from "../../types/destination";

export function getFeaturedDestinations(
  destinations: Destination[],
  month?: Month,
  limit = 6,
): Destination[] {
  const filtered = month
    ? destinations.filter((destination) =>
        destination.recommended_months.includes(month),
      )
    : destinations;

  return [...filtered]
    .sort((a, b) => {
      if (a.crowd_level !== b.crowd_level) {
        return a.crowd_level - b.crowd_level;
      }
      if (a.ticket_cost_omr !== b.ticket_cost_omr) {
        return a.ticket_cost_omr - b.ticket_cost_omr;
      }
      return a.id.localeCompare(b.id);
    })
    .slice(0, limit);
}
