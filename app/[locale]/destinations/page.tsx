import Link from "next/link";
import BrowseDestinationCard from "../../../components/destinations/BrowseDestinationCard";
import FiltersBar from "../../../components/destinations/FiltersBar";
import { loadDestinations } from "../../../lib/data/load";
import { filterAndSortDestinations } from "../../../lib/data/query";
import type { BrowseQuery } from "../../../lib/data/query";
import type {
  Locale,
  Month,
  RegionKey,
  Category,
  Destination,
} from "../../../types/destination";
import { tName } from "../../../lib/i18n/strings";
import { resolveFeaturedImage } from "../../../lib/home/featuredImage";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

function getActiveFilters(query: BrowseQuery, locale: Locale) {
  const isArabic = locale === "ar";
  const labelMap = {
    category: isArabic ? "التصنيف" : "Category",
    region: isArabic ? "المنطقة" : "Region",
    month: isArabic ? "الشهر" : "Month",
    season: isArabic ? "الموسم" : "Season",
    sort: isArabic ? "الترتيب" : "Sort",
  };
  const chips: string[] = [];
  if (query.category) chips.push(`${labelMap.category}: ${query.category}`);
  if (query.region) chips.push(`${labelMap.region}: ${query.region}`);
  if (query.month) chips.push(`${labelMap.month}: ${query.month}`);
  if (query.season) chips.push(`${labelMap.season}: ${query.season}`);
  if (query.sort) chips.push(`${labelMap.sort}: ${query.sort}`);
  return chips;
}

const PAGE_SIZE = 12;

function parsePage(value?: string | string[]): number {
  if (!value || Array.isArray(value)) {
    return 1;
  }
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed;
  }
  return 1;
}

function filterByQuery(
  destinations: Destination[],
  query: string,
  locale: Locale,
): Destination[] {
  if (!query) {
    return destinations;
  }
  const needle = query.toLowerCase();
  return destinations.filter((destination) =>
    tName(destination, locale).toLowerCase().includes(needle),
  );
}

function buildQueryString(
  params: Record<string, string | string[] | undefined>,
  page: number,
): string {
  const next = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => next.append(key, item));
    } else {
      next.set(key, value);
    }
  });
  if (page <= 1) {
    next.delete("page");
  } else {
    next.set("page", String(page));
  }
  const query = next.toString();
  return query ? `?${query}` : "";
}

export default async function DestinationsPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const isArabic = resolvedParams.locale === "ar";
  const labels = {
    title: isArabic ? "استكشف وجهات عُمان" : "Explore Destinations Across Oman",
    subtitle: isArabic
      ? "اكتشف الجبال والشواطئ والصحارى والمعالم الثقافية عبر أنحاء البلاد."
      : "Discover mountains, beaches, deserts, and cultural landmarks across the country.",
    noFilters: isArabic ? "لا توجد فلاتر مفعّلة." : "No filters applied.",
    showing: isArabic ? "عرض" : "Showing",
    of: isArabic ? "من" : "of",
    prev: isArabic ? "السابق" : "Prev",
    next: isArabic ? "التالي" : "Next",
  };
  const query: BrowseQuery = {
    category: parseCategory(resolvedSearch.category),
    region: parseRegion(resolvedSearch.region),
    month: parseMonth(resolvedSearch.month),
    season: parseSeason(resolvedSearch.season),
    sort: parseSort(resolvedSearch.sort),
  };

  const destinations = loadDestinations();
  const results = filterAndSortDestinations(destinations, query);
  const searchQuery =
    typeof resolvedSearch.q === "string" ? resolvedSearch.q : "";
  const searched = filterByQuery(results, searchQuery, resolvedParams.locale);
  const page = parsePage(resolvedSearch.page);
  const total = searched.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(total, startIndex + PAGE_SIZE);
  const paged = searched.slice(startIndex, endIndex);
  const chips = getActiveFilters(query, resolvedParams.locale);

  return (
    <div className="space-y-6">
      <section
        className="relative left-1/2 right-1/2 -mx-[50vw] -mt-24 w-screen overflow-hidden"
        style={{
          backgroundImage: "url('/oman2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/25" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative px-8 pb-24 pt-36 md:pb-28 md:pt-40">
          <div className={`mx-auto max-w-6xl ${isArabic ? "text-right" : "text-left"}`}>
            <div className="max-w-2xl space-y-3">
              <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
                {labels.title}
              </h1>
              <p className="text-sm text-white/85 sm:text-base">
                {labels.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative -mt-14 px-4 sm:-mt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white/70 p-4 shadow-lg backdrop-blur sm:p-5">
          <FiltersBar
            category={resolvedSearch.category as string | undefined}
            region={resolvedSearch.region as string | undefined}
            season={resolvedSearch.season as string | undefined}
            sort={resolvedSearch.sort as string | undefined}
            query={searchQuery}
            locale={resolvedParams.locale}
          />
        </div>
      </div>

      <div className={`flex flex-wrap gap-2 ${isArabic ? "text-right" : "text-left"}`}>
        {chips.length === 0 ? (
          <span className="text-sm text-zinc-500">{labels.noFilters}</span>
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

      <div className={`flex items-center justify-between text-sm text-zinc-500 ${isArabic ? "flex-row-reverse" : ""}`}>
        <span>
          {labels.showing} {total === 0 ? 0 : startIndex + 1}–{endIndex}{" "}
          {labels.of} {total}
        </span>
        <div className="flex gap-2">
          <Link
            href={`/${resolvedParams.locale}/destinations${buildQueryString(
              resolvedSearch,
              safePage - 1,
            )}`}
            scroll={false}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium",
              safePage <= 1
                ? "pointer-events-none border-zinc-100 text-zinc-300"
                : "border-zinc-200 text-zinc-600",
            ].join(" ")}
          >
            {labels.prev}
          </Link>
          <Link
            href={`/${resolvedParams.locale}/destinations${buildQueryString(
              resolvedSearch,
              safePage + 1,
            )}`}
            scroll={false}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium",
              safePage >= totalPages
                ? "pointer-events-none border-zinc-100 text-zinc-300"
                : "border-zinc-200 text-zinc-600",
            ].join(" ")}
          >
            {labels.next}
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((destination) => (
          <BrowseDestinationCard
            key={destination.id}
            destination={destination}
            locale={resolvedParams.locale}
            imageSrc={resolveFeaturedImage(destination, destinations)}
          />
        ))}
      </div>
    </div>
  );
}
