import { notFound } from "next/navigation";
import CrowdViz from "../../../../components/destinations/CrowdViz";
import MapPreview from "../../../../components/destinations/MapPreview";
import MonthsIndicator from "../../../../components/destinations/MonthsIndicator";
import SaveInterestButton from "../../../../components/destinations/SaveInterestButton";
import { byIdMap, loadDestinations } from "../../../../lib/data/load";
import { tCompany, tName, tRegion } from "../../../../lib/i18n/strings";
import type { Locale } from "../../../../types/destination";

type Props = {
  params: { id: string; locale: Locale };
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
  const destinations = loadDestinations();
  const map = byIdMap(destinations);
  const destination = map.get(params.id);

  if (!destination) {
    notFound();
  }

  const description = `${tName(destination, params.locale)} is a ${
    destination.categories[0]
  } destination in ${tRegion(destination, params.locale)}.`;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">
              {tName(destination, params.locale)}
            </h1>
            <p className="text-sm text-zinc-500">
              {tRegion(destination, params.locale)}
            </p>
          </div>
          <SaveInterestButton destinationId={destination.id} />
        </div>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <p className="text-sm text-zinc-700">{description}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-zinc-500">Company</div>
            <div className="text-sm">{tCompany(destination, params.locale)}</div>
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
          <div className="space-y-1">
            <div className="text-sm font-medium text-zinc-500">Duration</div>
            <div className="text-sm">
              {formatDuration(destination.avg_visit_duration_minutes)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-zinc-500">Ticket cost</div>
            <div className="text-sm">
              {destination.ticket_cost_omr.toFixed(2)} OMR
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
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

      <MapPreview lat={destination.lat} lng={destination.lng} />
    </div>
  );
}
