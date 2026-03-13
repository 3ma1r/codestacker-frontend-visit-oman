import { notFound } from "next/navigation";
import { use } from "react";
import CrowdViz from "../../../../components/destinations/CrowdViz";
import MapPreview from "../../../../components/destinations/MapPreview";
import MonthsIndicator from "../../../../components/destinations/MonthsIndicator";
import SaveInterestButton from "../../../../components/destinations/SaveInterestButton";
import { byIdMap, loadDestinations } from "../../../../lib/data/load";
import { tCompany, tName, tRegion } from "../../../../lib/i18n/strings";
import type { Locale } from "../../../../types/destination";
import { isLocale } from "../../../../lib/i18n/locale";
import { resolveFeaturedImage } from "../../../../lib/home/featuredImage";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes}m`;
  }
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

export default function DestinationDetailsPage({ params }: Props) {
  const { id, locale: rawLocale } = use(params);
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const destinations = loadDestinations();
  const map = byIdMap(destinations);
  const destination = map.get(id);

  if (!destination) {
    notFound();
  }

  const description = `${tName(destination, locale)} is a ${
    destination.categories[0]
  } destination in ${tRegion(destination, locale)}.`;
  const imageSrc = resolveFeaturedImage(destination, destinations);

  return (
    <div className="relative space-y-6" data-page="destination-details">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.12)_1px,transparent_0)] [background-size:26px_26px]" />
      <div className="relative space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">
            {tName(destination, locale)}
          </h1>
          <p className="text-sm text-zinc-500">{tRegion(destination, locale)}</p>
        </div>
        <div className="rounded-full bg-white/90 px-3 py-2 shadow">
          <SaveInterestButton destinationId={destination.id} />
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-[55%_45%] md:items-stretch">
        <div className="flex flex-col">
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/80">
            <img
              src={imageSrc}
              alt={tName(destination, locale)}
              className="h-[320px] w-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-zinc-200 bg-white/80 p-4">
            <p className="text-sm text-zinc-700">{description}</p>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white/80 p-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-zinc-500">Company</div>
                <div className="text-sm">{tCompany(destination, locale)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-zinc-500">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {destination.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-zinc-500">Crowd level</div>
                <CrowdViz level={destination.crowd_level} />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-zinc-500">
                  Recommended months
                </div>
                <MonthsIndicator months={destination.recommended_months} />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="relative py-6">
        <div className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-zinc-300/90" />
        <div className="relative grid gap-6 text-center sm:grid-cols-3">
          <div className="group">
            <div className="text-xs font-medium text-zinc-500 transition group-hover:text-zinc-700">
              Duration
            </div>
            <div className="flex justify-center py-3">
              <span className="h-3 w-3 rounded-full bg-emerald-600 transition duration-200 group-hover:scale-110" />
            </div>
            <div className="text-sm font-semibold text-zinc-900 transition group-hover:text-zinc-800">
              {formatDuration(destination.avg_visit_duration_minutes)}
            </div>
            <div className="mt-1 text-[11px] text-zinc-400 opacity-0 transition group-hover:opacity-100">
              Estimated visit time
            </div>
          </div>

          <div className="group">
            <div className="text-xs font-medium text-zinc-500 transition group-hover:text-zinc-700">
              Ticket
            </div>
            <div className="flex justify-center py-3">
              <span className="h-3 w-3 rounded-full bg-emerald-600 transition duration-200 group-hover:scale-110" />
            </div>
            <div className="text-sm font-semibold text-zinc-900 transition group-hover:text-zinc-800">
              {destination.ticket_cost_omr.toFixed(2)} OMR
            </div>
            <div className="mt-1 text-[11px] text-zinc-400 opacity-0 transition group-hover:opacity-100">
              Entry cost
            </div>
          </div>

          <div className="group">
            <div className="text-xs font-medium text-zinc-500 transition group-hover:text-zinc-700">
              Region
            </div>
            <div className="flex justify-center py-3">
              <span className="h-3 w-3 rounded-full bg-emerald-600 transition duration-200 group-hover:scale-110" />
            </div>
            <div className="text-sm font-semibold text-zinc-900 transition group-hover:text-zinc-800">
              {tRegion(destination, locale)}
            </div>
            <div className="mt-1 text-[11px] text-zinc-400 opacity-0 transition group-hover:opacity-100">
              Location in Oman
            </div>
          </div>
        </div>
      </section>

      <MapPreview lat={destination.lat} lng={destination.lng} />
      </div>
    </div>
  );
}
