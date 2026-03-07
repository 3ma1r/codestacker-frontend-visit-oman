import Link from "next/link";
import FeaturedMiniCard from "../../components/home/FeaturedMiniCard";
import { getFeaturedDestinations } from "../../lib/data/featured";
import { loadDestinations } from "../../lib/data/load";
import type { Locale } from "../../types/destination";

type Props = {
  params: Promise<{ locale: Locale }>;
};

const CATEGORY_CARDS = [
  { label: { en: "Mountain", ar: "جبال" }, href: "category=mountain" },
  { label: { en: "Desert", ar: "صحراء" }, href: "category=desert" },
  { label: { en: "Sea", ar: "بحر" }, href: "category=beach" },
  { label: { en: "Culture", ar: "ثقافة" }, href: "category=culture" },
];

export default async function DiscoverPage({ params }: Props) {
  const destinations = loadDestinations();
  const featured = getFeaturedDestinations(destinations, 1, 6);
  const { locale } = await params;
  const isArabic = locale === "ar";
  const regionsCount = new Set(destinations.map((dest) => dest.regionKey)).size;
  const categoriesCount = new Set(
    destinations.flatMap((dest) => dest.categories),
  ).size;
  return (
    <div className="space-y-12">
      <section className="rounded-[32px] border border-black/10 bg-[#F6F1E7] px-8 py-12">
        <div className={`space-y-5 ${isArabic ? "text-right" : "text-left"}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
              <span className="text-orange-500">●</span>
              <span>{isArabic ? "استكشف عُمان" : "Explore Oman"}</span>
            </div>
            <h1 className="text-4xl font-bold uppercase tracking-tight text-neutral-900 md:text-6xl">
              {isArabic ? "اكتشف عُمان" : "EXPLORE OMAN"}
            </h1>
            <p className="max-w-xl text-sm text-neutral-600 md:text-base">
              {isArabic
                ? "استكشف الوجهات والمواسم بأسلوب مبني على البيانات."
                : "A data-driven preview of destinations, seasons, and travel vibes."}
            </p>
            <div className={`flex flex-wrap gap-3 ${isArabic ? "justify-end" : ""}`}>
              <Link
                href={`/${locale}/planner`}
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
              >
                {isArabic ? "خطط لرحلتك" : "Plan your trip"}
              </Link>
              <Link
                href={`/${locale}/destinations`}
                className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-white/90"
              >
                {isArabic ? "تصفح الوجهات" : "Browse destinations"}
              </Link>
            </div>
        </div>
      </section>

      <section className={`flex flex-wrap gap-3 ${isArabic ? "text-right" : "text-left"}`}>
        <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm">
          {destinations.length} {isArabic ? "وجهة" : "destinations"}
        </div>
        <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm">
          {regionsCount} {isArabic ? "مناطق" : "regions"}
        </div>
        <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm">
          {categoriesCount} {isArabic ? "تصنيفات" : "categories"}
        </div>
      </section>

      <section className="space-y-4">
        <h2
          className={`text-xl font-semibold ${isArabic ? "text-right" : "text-left"}`}
        >
          {isArabic ? "استكشف حسب التصنيف" : "Explore by category"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_CARDS.map((card) => (
            <Link
              key={card.label.en}
              href={`/${locale}/destinations?${card.href}`}
              className="rounded-2xl border border-black/10 bg-white p-5 text-sm font-semibold text-neutral-800 shadow-sm transition hover:-translate-y-0.5 hover:border-black/20"
            >
              {card.label[isArabic ? "ar" : "en"]}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className={`flex items-center justify-between ${isArabic ? "text-right" : "text-left"}`}>
          <h2 className="text-xl font-semibold">
            {isArabic ? "وجهات مميزة" : "Featured destinations"}
          </h2>
          <span className="text-sm text-zinc-500">
            {isArabic ? "الشهر: 1" : "Month: 1"}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((destination) => (
            <div key={destination.id} className="min-w-0">
              <FeaturedMiniCard
                destination={destination}
                locale={locale}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
