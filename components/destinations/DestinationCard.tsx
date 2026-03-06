import Link from "next/link";
import type { Destination, Locale } from "../../types/destination";
import { tName, tRegion } from "../../lib/i18n/strings";
import CrowdViz from "./CrowdViz";
import SaveInterestButton from "./SaveInterestButton";

type Props = {
  destination: Destination;
  locale: Locale;
};

export default function DestinationCard({ destination, locale }: Props) {
  return (
    <Link
      href={`/${locale}/destinations/${destination.id}`}
      className="flex h-full flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300"
    >
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">
            {tName(destination, locale)}
          </h3>
          <p className="text-sm text-zinc-500">{tRegion(destination, locale)}</p>
        </div>

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

        <div className="flex items-center gap-3 text-sm text-zinc-600">
          <span>Cost: {destination.ticket_cost_omr.toFixed(2)} OMR</span>
          {destination.ticket_cost_omr === 0 && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Free entry
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <CrowdViz level={destination.crowd_level} />
        <SaveInterestButton destinationId={destination.id} />
      </div>
    </Link>
  );
}
