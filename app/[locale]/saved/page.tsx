"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { isLocale, type Locale } from "../../../lib/i18n/locale";
import { loadDestinations } from "../../../lib/data/load";
import SavedFeaturedCard from "../../../components/saved/SavedFeaturedCard";
import { useAppStore } from "../../../store/useAppStore";
import type { Destination } from "../../../types/destination";

export default function SavedPage() {
  const params = useParams();
  const raw = params?.locale;
  const locale: Locale =
    typeof raw === "string" && isLocale(raw) ? raw : "en";
  const destinations = useMemo(() => loadDestinations(), []);
  const savedInterests = useAppStore((state) => state.savedInterests);
  const toggleSave = useAppStore((state) => state.toggleSave);
  const byId = useMemo(
    () => new Map(destinations.map((destination) => [destination.id, destination])),
    [destinations],
  );

  const savedDestinations = savedInterests
    .map((id) => byId.get(id))
    .filter((destination): destination is Destination => Boolean(destination));

  const title =
    locale === "ar" ? "الوجهات المحفوظة" : "Saved Destinations";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Link
          href={`/${locale}/planner`}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {locale === "ar" ? "خطط بالمحفوظات" : "Plan with saved"}
        </Link>
      </div>

      {savedDestinations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          {locale === "ar"
            ? "لا توجد وجهات محفوظة بعد."
            : "No saved destinations yet."}
          <div className="mt-3">
            <Link
              href={`/${locale}/destinations`}
              className="text-sm font-medium underline"
            >
              {locale === "ar" ? "تصفح الوجهات" : "Browse destinations"}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedDestinations.map((destination) => (
            <SavedFeaturedCard
              key={destination.id}
              destination={destination}
              locale={locale}
              onRemove={toggleSave}
              allDestinations={destinations}
            />
          ))}
        </div>
      )}

      {savedDestinations.length > 0 && (
        <div className="text-sm text-zinc-500">
          {locale === "ar"
            ? `المحفوظات: ${savedDestinations.length}`
            : `Saved: ${savedDestinations.length}`}
        </div>
      )}
    </div>
  );
}
