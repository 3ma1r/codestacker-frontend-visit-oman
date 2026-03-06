import type {
  Category,
  Destination,
  Month,
  RegionKey,
} from "../../types/destination";

export type BrowseQuery = {
  category?: Category;
  region?: RegionKey;
  month?: Month;
  season?: "winter" | "spring" | "summer" | "autumn";
  sort?: "crowd" | "cost";
};

const SEASON_MAP: Record<NonNullable<BrowseQuery["season"]>, Month[]> = {
  winter: [12, 1, 2],
  spring: [3, 4, 5],
  summer: [6, 7, 8],
  autumn: [9, 10, 11],
};

export function seasonToMonths(
  season: BrowseQuery["season"],
): Month[] {
  if (!season) {
    return [];
  }
  return SEASON_MAP[season];
}

export function filterAndSortDestinations(
  destinations: Destination[],
  query: BrowseQuery,
): Destination[] {
  const seasonMonths = seasonToMonths(query.season);

  const filtered = destinations.filter((destination) => {
    if (query.category && !destination.categories.includes(query.category)) {
      return false;
    }
    if (query.region && destination.regionKey !== query.region) {
      return false;
    }
    if (
      query.month &&
      !destination.recommended_months.includes(query.month)
    ) {
      return false;
    }
    if (
      seasonMonths.length > 0 &&
      !seasonMonths.some((month) =>
        destination.recommended_months.includes(month),
      )
    ) {
      return false;
    }
    return true;
  });

  const sorted = [...filtered];
  if (query.sort === "crowd") {
    sorted.sort((a, b) => {
      if (a.crowd_level !== b.crowd_level) {
        return a.crowd_level - b.crowd_level;
      }
      return a.id.localeCompare(b.id);
    });
  } else if (query.sort === "cost") {
    sorted.sort((a, b) => {
      if (a.ticket_cost_omr !== b.ticket_cost_omr) {
        return a.ticket_cost_omr - b.ticket_cost_omr;
      }
      return a.id.localeCompare(b.id);
    });
  } else {
    sorted.sort((a, b) => a.id.localeCompare(b.id));
  }

  return sorted;
}

/*
Usage:
const destinations = loadDestinations();
const results = filterAndSortDestinations(destinations, {
  region: "muscat",
  sort: "cost",
});
*/
