"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Locale } from "../../../lib/i18n/locale";
import { loadDestinations } from "../../../lib/data/load";
import DestinationCard from "../../../components/destinations/DestinationCard";
import { useAppStore } from "../../../store/useAppStore";
import type { Destination } from "../../../types/destination";

type Props = {
  params: { locale: Locale };
};

export default function SavedPage({ params }: Props) {
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
    params.locale === "ar" ? "الوجهات المحفوظة" : "Saved Destinations";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Link
          href={`/${params.locale}/planner`}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {params.locale === "ar" ? "خطط بالمحفوظات" : "Plan with saved"}
        </Link>
      </div>

      {savedDestinations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          {params.locale === "ar"
            ? "لا توجد وجهات محفوظة بعد."
            : "No saved destinations yet."}
          <div className="mt-3">
            <Link
              href={`/${params.locale}/destinations`}
              className="text-sm font-medium underline"
            >
              {params.locale === "ar" ? "تصفح الوجهات" : "Browse destinations"}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedDestinations.map((destination) => (
            <div key={destination.id} className="relative">
              <DestinationCard destination={destination} locale={params.locale} />
              <button
                type="button"
                onClick={() => toggleSave(destination.id)}
                className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-zinc-700 shadow"
              >
                {params.locale === "ar" ? "إزالة" : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}

      {savedDestinations.length > 0 && (
        <div className="text-sm text-zinc-500">
          {params.locale === "ar"
            ? `المحفوظات: ${savedDestinations.length}`
            : `Saved: ${savedDestinations.length}`}
        </div>
      )}
    </div>
  );
}
