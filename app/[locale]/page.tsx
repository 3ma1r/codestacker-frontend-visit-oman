import Link from "next/link";
import FeaturedImageCard from "../../components/home/FeaturedImageCard";
import { getFeaturedDestinations } from "../../lib/data/featured";
import { loadDestinations } from "../../lib/data/load";
import type { Locale } from "../../types/destination";
import path from "node:path";
import fs from "node:fs";

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
  const { locale } = await params;
  const currentMonth = new Date().getMonth() + 1;
  const featured = getFeaturedDestinations(destinations, currentMonth, 12);
  const isArabic = locale === "ar";
  const regionsCount = new Set(destinations.map((dest) => dest.regionKey)).size;
  const categoriesCount = new Set(
    destinations.flatMap((dest) => dest.categories),
  ).size;

  const monthNamesEn = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthNamesAr = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
  const imageCache = new Map<string, string>();
  const nameImageCache = new Map<string, string>();
  const fallbackImage = "/oman.webp";

  const resolveImageForId = (id: string) => {
    if (imageCache.has(id)) {
      return imageCache.get(id) as string;
    }
    const basePath = path.join(
      process.cwd(),
      "public",
      "images",
      "destinations",
      id,
    );
    for (const ext of imageExtensions) {
      const filePath = `${basePath}${ext}`;
      if (fs.existsSync(filePath)) {
        const url = `/images/destinations/${id}${ext}`;
        imageCache.set(id, url);
        return url;
      }
    }
    return null;
  };

  const resolveImage = (destinationId: string, nameEn: string) => {
    const direct = resolveImageForId(destinationId);
    if (direct) {
      nameImageCache.set(nameEn, direct);
      return direct;
    }
    if (nameImageCache.has(nameEn)) {
      return nameImageCache.get(nameEn) as string;
    }
    return fallbackImage;
  };

  const uniqueFeatured = [];
  const seenNames = new Set<string>();
  for (const destination of featured) {
    if (seenNames.has(destination.name.en)) {
      continue;
    }
    uniqueFeatured.push(destination);
    seenNames.add(destination.name.en);
    if (uniqueFeatured.length >= 6) {
      break;
    }
  }
  return (
    <div className="space-y-12">
      <section
        className="relative left-1/2 right-1/2 -mx-[50vw] -mt-24 w-screen overflow-hidden"
        style={{
          backgroundImage: "url('/oman.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="relative px-8 pb-24 pt-32 md:pb-28 md:pt-36">
          <div className={`mx-auto max-w-6xl space-y-5 ${isArabic ? "text-right" : "text-left"}`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <span className="text-orange-400">●</span>
              <span>{isArabic ? "استكشف عُمان" : "Explore Oman"}</span>
            </div>
            <h1 className="text-4xl font-bold uppercase tracking-tight text-white md:text-6xl">
              {isArabic ? "اكتشف عُمان" : "EXPLORE OMAN"}
            </h1>
            <p className="max-w-xl text-sm text-white/90 md:text-base">
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
                className="rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {isArabic ? "تصفح الوجهات" : "Browse destinations"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-3 md:py-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.1)_1px,transparent_0)] [background-size:18px_18px]" />
        <div
          className={`grid items-start gap-6 md:gap-8 lg:grid-cols-2 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          <div className="flex flex-col gap-6 self-start">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                {isArabic ? "استكشف عبر عُمان" : "Explore Across Oman"}
              </p>
              <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">
                {isArabic
                  ? "طريقة أذكى لاستكشاف عُمان"
                  : "A Smarter Way to Explore Oman"}
              </h2>
              <p className="max-w-xl text-sm text-neutral-600 md:text-base">
                {isArabic
                  ? "اكتشف عُمان عبر المناطق والوجهات وتجارب السفر بطريقة أوضح وأكثر إلهامًا. اعثر على الأماكن التي تناسب اهتماماتك وخطط للرحلات بثقة أكبر."
                  : "Discover Oman through regions, destinations, and travel experiences in a clearer and more inspiring way. Find places that match your interests and plan journeys with more confidence."}
              </p>
            </div>
            <div className="mt-2 grid items-end gap-3 sm:grid-cols-3">
              <button
                type="button"
                className="min-h-[92px] rounded-2xl border border-black/20 px-2 py-2 text-left transition hover:border-black/35 hover:shadow-sm active:scale-[0.99] active:border-black/40"
              >
                <div className="text-5xl font-semibold leading-none text-neutral-900">
                  {destinations.length}
                </div>
                <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                  {isArabic ? "وجهة" : "Destinations"}
                </div>
              </button>
              <button
                type="button"
                className="min-h-[92px] rounded-2xl border border-black/20 px-2 py-2 text-left transition hover:border-black/35 hover:shadow-sm active:scale-[0.99] active:border-black/40"
              >
                <div className="text-4xl font-semibold leading-none text-neutral-900">
                  {regionsCount}
                </div>
                <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                  {isArabic ? "مناطق" : "Regions"}
                </div>
              </button>
              <button
                type="button"
                className="min-h-[92px] rounded-2xl border border-black/20 px-2 py-2 text-left transition hover:border-black/35 hover:shadow-sm active:scale-[0.99] active:border-black/40"
              >
                <div className="text-4xl font-semibold leading-none text-neutral-900">
                  {categoriesCount}
                </div>
                <div className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                  {isArabic ? "تصنيفات" : "Categories"}
                </div>
              </button>
            </div>
          </div>
          <div className="relative -mt-2 flex items-start justify-center lg:justify-end">
            <img
              src="/map.png"
              alt="Oman map"
              className="h-auto w-full max-w-[260px] object-contain sm:max-w-xs md:max-w-sm"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2
          className={`text-xl font-semibold ${isArabic ? "text-right" : "text-left"}`}
        >
          {isArabic ? "استكشف حسب التصنيف" : "Explore by category"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_CARDS.map((card) => {
            const imageMap: Record<string, string> = {
              mountain: "/images/category/mountain.jpg",
              desert: "/images/category/desert.avif",
              beach: "/images/category/sea.jpg",
              culture: "/images/category/culture.jpg",
            };
            const imageSrc = imageMap[card.href.split("=")[1]] ?? "/images/category/sea.jpg";
            return (
              <Link
                key={card.label.en}
                href={`/${locale}/destinations?${card.href}`}
                className="group relative overflow-hidden rounded-3xl"
              >
                <img
                  src={imageSrc}
                  alt={card.label[isArabic ? "ar" : "en"]}
                  className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent backdrop-blur-[1px]" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-lg font-semibold text-white">
                    {card.label[isArabic ? "ar" : "en"]}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className={`flex items-center justify-between ${isArabic ? "text-right" : "text-left"}`}>
          <h2 className="text-xl font-semibold">
            {isArabic ? "وجهات مميزة" : "Featured destinations"}
          </h2>
          <span className="text-sm text-zinc-500">
            {isArabic ? "الشهر الحالي: " : "Current Month: "}
            {isArabic ? monthNamesAr[currentMonth - 1] : monthNamesEn[currentMonth - 1]}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {uniqueFeatured.map((destination) => (
            <div key={destination.id} className="min-w-0">
              <FeaturedImageCard
                destination={destination}
                locale={locale}
                imageSrc={resolveImage(destination.id, destination.name.en)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-6">
          <Link
            href={`/${locale}/destinations`}
            className="rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            {isArabic ? "عرض المزيد" : "View More"}
          </Link>
        </div>
      </section>
    </div>
  );
}
