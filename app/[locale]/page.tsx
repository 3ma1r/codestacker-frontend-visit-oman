import Link from "next/link";
import DestinationCard from "../../components/destinations/DestinationCard";
import { getFeaturedDestinations } from "../../lib/data/featured";
import { loadDestinations } from "../../lib/data/load";
import type { Locale } from "../../types/destination";

type Props = {
  params: Promise<{ locale: Locale }>;
};

const CATEGORY_CARDS = [
  { label: "Mountain", href: "category=mountain" },
  { label: "Desert", href: "category=desert" },
  { label: "Sea", href: "category=beach" },
  { label: "Culture", href: "category=culture" },
];

export default async function DiscoverPage({ params }: Props) {
  const destinations = loadDestinations();
  const featured = getFeaturedDestinations(destinations, 1, 6);
  const { locale } = await params;

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-zinc-900 px-8 py-12 text-white">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-zinc-300">
            Visit Oman
          </p>
          <h1 className="text-3xl font-semibold">Discover Oman</h1>
          <p className="max-w-xl text-sm text-zinc-200">
            A data-driven preview of destinations, seasons, and travel vibes.
          </p>
          <Link
            href={`/${locale}/planner`}
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-zinc-900"
          >
            Plan your trip
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Explore by category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_CARDS.map((card) => (
            <Link
              key={card.label}
              href={`/${locale}/destinations?${card.href}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300"
            >
              {card.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured destinations</h2>
          <span className="text-sm text-zinc-500">Month: 1</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
