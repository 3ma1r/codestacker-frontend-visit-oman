import Link from "next/link";
import type { Destination, Locale } from "../../types/destination";
import { tName, tRegion } from "../../lib/i18n/strings";
import CrowdViz from "../destinations/CrowdViz";
import SaveInterestButton from "../destinations/SaveInterestButton";

type Props = {
  destination: Destination;
  locale: Locale;
};

export default function FeaturedMiniCard({ destination, locale }: Props) {
  return (
    <Link
      href={`/${locale}/destinations/${destination.id}`}
      className="flex min-w-[260px] flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300"
    >
      <div className="space-y-2">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">
            {tName(destination, locale)}
          </h3>
          <p className="text-xs text-zinc-500">{tRegion(destination, locale)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {destination.categories.map((category) => (
            <span
              key={category}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <CrowdViz level={destination.crowd_level} />
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600">
            {destination.ticket_cost_omr === 0
              ? "Free"
              : `${destination.ticket_cost_omr.toFixed(2)} OMR`}
          </span>
          <SaveInterestButton destinationId={destination.id} />
        </div>
      </div>
    </Link>
  );
}
