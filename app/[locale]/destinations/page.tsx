import DestinationCard from "../../../components/destinations/DestinationCard";
import FiltersBar from "../../../components/destinations/FiltersBar";
import { loadDestinations } from "../../../lib/data/load";
import { filterAndSortDestinations } from "../../../lib/data/query";
import type { BrowseQuery } from "../../../lib/data/query";
import type { Locale, Month, RegionKey, Category } from "../../../types/destination";

type Props = {
  params: { locale: Locale };
  searchParams: Record<string, string | string[] | undefined>;
};

const CATEGORY_VALUES: Category[] = [
  "mountain",
  "beach",
  "culture",
  "desert",
  "nature",
  "food",
];

const REGION_VALUES: RegionKey[] = [
  "muscat",
  "dakhiliya",
  "sharqiya",
  "dhofar",
  "batinah",
  "dhahira",
];

const SEASON_VALUES: NonNullable<BrowseQuery["season"]>[] = [
  "winter",
  "spring",
  "summer",
  "autumn",
];

function parseMonth(value?: string | string[]): Month | undefined {
  if (!value || Array.isArray(value)) {
    return undefined;
  }
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 12) {
    return parsed as Month;
  }
  return undefined;
}

function parseCategory(value?: string | string[]): Category | undefined {
  if (!value || Array.isArray(value)) {
    return undefined;
  }
  return CATEGORY_VALUES.includes(value as Category) ? (value as Category) : undefined;
}

function parseRegion(value?: string | string[]): RegionKey | undefined {
  if (!value || Array.isArray(value)) {
    return undefined;
  }
  return REGION_VALUES.includes(value as RegionKey) ? (value as RegionKey) : undefined;
}

function parseSeason(
  value?: string | string[],
): BrowseQuery["season"] | undefined {
  if (!value || Array.isArray(value)) {
    return undefined;
  }
  return SEASON_VALUES.includes(value as BrowseQuery["season"])
    ? (value as BrowseQuery["season"])
    : undefined;
}

function parseSort(value?: string | string[]): BrowseQuery["sort"] | undefined {
  if (!value || Array.isArray(value)) {
    return undefined;
  }
  return value === "crowd" || value === "cost" ? value : undefined;
}

function getActiveFilters(query: BrowseQuery) {
  const chips: string[] = [];
  if (query.category) chips.push(`Category: ${query.category}`);
  if (query.region) chips.push(`Region: ${query.region}`);
  if (query.month) chips.push(`Month: ${query.month}`);
  if (query.season) chips.push(`Season: ${query.season}`);
  if (query.sort) chips.push(`Sort: ${query.sort}`);
  return chips;
}

export default function DestinationsPage({ params, searchParams }: Props) {
  const query: BrowseQuery = {
    category: parseCategory(searchParams.category),
    region: parseRegion(searchParams.region),
    month: parseMonth(searchParams.month),
    season: parseSeason(searchParams.season),
    sort: parseSort(searchParams.sort),
  };

  const destinations = loadDestinations();
  const results = filterAndSortDestinations(destinations, query);
  const chips = getActiveFilters(query);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Browse destinations</h1>
        <p className="text-sm text-zinc-500">
          Filter by category, region, or season. Sorting is deterministic.
        </p>
      </header>

      <FiltersBar
        category={searchParams.category as string | undefined}
        region={searchParams.region as string | undefined}
        season={searchParams.season as string | undefined}
        sort={searchParams.sort as string | undefined}
      />

      <div className="flex flex-wrap gap-2">
        {chips.length === 0 ? (
          <span className="text-sm text-zinc-500">No filters applied.</span>
        ) : (
          chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600"
            >
              {chip}
            </span>
          ))
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            locale={params.locale}
          />
        ))}
      </div>
    </div>
  );
}
