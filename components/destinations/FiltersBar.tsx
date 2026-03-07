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
  query?: string;
  locale: "en" | "ar";
};

export default function FiltersBar({
  category,
  region,
  season,
  sort,
  query,
  locale,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isArabic = locale === "ar";
  const labels = {
    category: isArabic ? "التصنيف" : "Category",
    region: isArabic ? "المنطقة" : "Region",
    season: isArabic ? "الموسم" : "Season",
    sort: isArabic ? "الترتيب" : "Sort",
    search: isArabic ? "بحث" : "Search",
    all: isArabic ? "الكل" : "All",
    any: isArabic ? "أي" : "Any",
    default: isArabic ? "افتراضي" : "Default",
    leastCrowded: isArabic ? "الأقل ازدحامًا" : "Least crowded",
    lowestCost: isArabic ? "الأقل تكلفة" : "Lowest cost",
    placeholder: isArabic ? "ابحث عن وجهات" : "Search destinations",
    winter: isArabic ? "الشتاء" : "winter",
    spring: isArabic ? "الربيع" : "spring",
    summer: isArabic ? "الصيف" : "summer",
    autumn: isArabic ? "الخريف" : "autumn",
  };
  const fieldClass = `rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-900 ${
    isArabic ? "text-right" : "text-left"
  }`;

  const updateParam = (
    key: string,
    value?: string,
    options: { resetPage?: boolean } = {},
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    if (options.resetPage !== false) {
      params.delete("page");
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white p-4">
      <label className={`flex flex-col gap-1 text-xs font-medium text-zinc-600 ${isArabic ? "text-right" : "text-left"}`}>
        {labels.category}
        <select
          className={fieldClass}
          value={category ?? ""}
          onChange={(event) =>
            updateParam("category", event.target.value, { resetPage: true })
          }
        >
          <option value="">{labels.all}</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className={`flex flex-col gap-1 text-xs font-medium text-zinc-600 ${isArabic ? "text-right" : "text-left"}`}>
        {labels.region}
        <select
          className={fieldClass}
          value={region ?? ""}
          onChange={(event) =>
            updateParam("region", event.target.value, { resetPage: true })
          }
        >
          <option value="">{labels.all}</option>
          {REGION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className={`flex flex-col gap-1 text-xs font-medium text-zinc-600 ${isArabic ? "text-right" : "text-left"}`}>
        {labels.season}
        <select
          className={fieldClass}
          value={season ?? ""}
          onChange={(event) =>
            updateParam("season", event.target.value, { resetPage: true })
          }
        >
          <option value="">{labels.any}</option>
          <option value="winter">{labels.winter}</option>
          <option value="spring">{labels.spring}</option>
          <option value="summer">{labels.summer}</option>
          <option value="autumn">{labels.autumn}</option>
        </select>
      </label>

      <label className={`flex flex-col gap-1 text-xs font-medium text-zinc-600 ${isArabic ? "text-right" : "text-left"}`}>
        {labels.sort}
        <select
          className={fieldClass}
          value={sort ?? ""}
          onChange={(event) =>
            updateParam("sort", event.target.value, { resetPage: true })
          }
        >
          <option value="">{labels.default}</option>
          <option value="crowd">{labels.leastCrowded}</option>
          <option value="cost">{labels.lowestCost}</option>
        </select>
      </label>

      <label className={`flex flex-col gap-1 text-xs font-medium text-zinc-600 ${isArabic ? "text-right" : "text-left"}`}>
        {labels.search}
        <input
          type="text"
          value={query ?? ""}
          onChange={(event) =>
            updateParam("q", event.target.value.trim(), { resetPage: true })
          }
          placeholder={labels.placeholder}
          className={fieldClass}
        />
      </label>
    </div>
  );
}
