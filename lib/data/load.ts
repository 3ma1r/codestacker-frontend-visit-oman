import raw from "../../data/data.json";
import type {
  Category,
  Destination,
  Month,
  RegionKey,
} from "../../types/destination";

const REGION_KEYS: RegionKey[] = [
  "muscat",
  "dakhiliya",
  "sharqiya",
  "dhofar",
  "batinah",
  "dhahira",
];

const CATEGORY_KEYS: Category[] = [
  "mountain",
  "beach",
  "culture",
  "desert",
  "nature",
  "food",
];

const MONTHS: Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function assertRegionKey(value: string, id: string): RegionKey {
  const key = value.toLowerCase();
  if (REGION_KEYS.includes(key as RegionKey)) {
    return key as RegionKey;
  }
  throw new Error(`Invalid region value "${value}" for destination ${id}`);
}

function assertCategory(value: string, id: string): Category {
  if (CATEGORY_KEYS.includes(value as Category)) {
    return value as Category;
  }
  throw new Error(`Invalid category "${value}" for destination ${id}`);
}

function assertMonth(value: number, id: string): Month {
  if (MONTHS.includes(value as Month)) {
    return value as Month;
  }
  throw new Error(`Invalid month "${value}" for destination ${id}`);
}

const CROWD_LEVELS = [1, 2, 3, 4, 5] as const;
type CrowdLevel = (typeof CROWD_LEVELS)[number];

function assertCrowdLevel(value: unknown, id: string): CrowdLevel {
  const n = Number(value);
  if (Number.isInteger(n) && n >= 1 && n <= 5) {
    return n as CrowdLevel;
  }
  throw new Error(`Invalid crowd_level "${value}" for destination ${id}`);
}

export function loadDestinations(): Destination[] {
  if (!Array.isArray(raw)) {
    throw new Error("Dataset root must be an array.");
  }

  return raw.map((item) => {
    const id = item.id as string;
    const regionKey = assertRegionKey(item.region?.en, id);
    const categories = (item.categories ?? []).map((category) =>
      assertCategory(category, id),
    );
    const recommended_months = (item.recommended_months ?? []).map((month) =>
      assertMonth(month, id),
    );

    return {
      id,
      name: item.name,
      lat: item.lat,
      lng: item.lng,
      region: item.region,
      regionKey,
      categories,
      company: item.company,
      avg_visit_duration_minutes: item.avg_visit_duration_minutes,
      ticket_cost_omr: item.ticket_cost_omr,
      recommended_months,
      crowd_level: assertCrowdLevel(item.crowd_level, id),
    };
  });
}

export function byIdMap(destinations: Destination[]): Map<string, Destination> {
  return new Map(destinations.map((destination) => [destination.id, destination]));
}

/*
Usage:
const destinations = loadDestinations();
const map = byIdMap(destinations);
*/
