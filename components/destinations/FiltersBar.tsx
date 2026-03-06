"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category, RegionKey } from "../../types/destination";

const CATEGORY_OPTIONS: Category[] = [
  "mountain",
  "beach",
  "culture",
  "desert",
  "nature",
  "food",
];

const REGION_OPTIONS: RegionKey[] = [
  "muscat",
  "dakhiliya",
  "sharqiya",
  "dhofar",
  "batinah",
  "dhahira",
];

type Props = {
  category?: string;
  region?: string;
  season?: string;
  sort?: string;
};

export default function FiltersBar({ category, region, season, sort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white p-4">
      <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
        Category
        <select
          className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-900"
          value={category ?? ""}
          onChange={(event) => updateParam("category", event.target.value)}
        >
          <option value="">All</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
        Region
        <select
          className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-900"
          value={region ?? ""}
          onChange={(event) => updateParam("region", event.target.value)}
        >
          <option value="">All</option>
          {REGION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
        Season
        <select
          className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-900"
          value={season ?? ""}
          onChange={(event) => updateParam("season", event.target.value)}
        >
          <option value="">Any</option>
          <option value="winter">winter</option>
          <option value="spring">spring</option>
          <option value="summer">summer</option>
          <option value="autumn">autumn</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
        Sort
        <select
          className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-900"
          value={sort ?? ""}
          onChange={(event) => updateParam("sort", event.target.value)}
        >
          <option value="">Default</option>
          <option value="crowd">Least crowded</option>
          <option value="cost">Lowest cost</option>
        </select>
      </label>
    </div>
  );
}
