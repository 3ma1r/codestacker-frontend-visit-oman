import Link from "next/link";
import type { Locale } from "@/lib/i18n/locale";

type Props = {
  locale: Locale;
  rtl: boolean;
};

const LABELS = {
  en: {
    home: "Home",
    destinations: "Destinations",
    tripPlanner: "Trip Planner",
    savedPlaces: "Saved Places",
    tagline: "Smart trip planning across Oman's diverse regions.",
    builtBy: "Built by Omair Al-Falahi",
    role: "Computer Engineering Student",
    copyright: "© 2026 Explore Oman | Built for tourism discovery",
  },
  ar: {
    home: "الرئيسية",
    destinations: "الوجهات",
    tripPlanner: "مخطط الرحلة",
    savedPlaces: "الأماكن المحفوظة",
    tagline: "تخطيط رحلات ذكي عبر مناطق عُمان المتنوعة.",
    builtBy: "صُمم بواسطة عمير الفلاحي",
    role: "طالب هندسة حاسوب",
    copyright: "© 2026 استكشف عُمان | صُمم لاكتشاف السياحة",
  },
} as const;

export default function Footer({ locale, rtl }: Props) {
  const t = LABELS[locale];

  return (
    <footer
      className="relative mt-auto overflow-hidden rounded-t-3xl"
      dir={rtl ? "rtl" : "ltr"}
    >
      {/* Soft layered curves – minimal Oman-inspired wave transition */}
      <div
        className="relative h-8 w-full sm:h-10"
        aria-hidden
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 50"
          preserveAspectRatio="none"
        >
          <path
            fill="#243d35"
            d="M0 50 Q400 15 600 35 T1200 25 L1200 50 Z"
          />
          <path
            fill="#1e3a2f"
            d="M0 50 Q300 30 600 45 T1200 40 L1200 50 Z"
          />
        </svg>
      </div>

      {/* Footer body */}
      <div className="relative bg-[#1e3a2f] px-6 py-6 text-[#f5f0e6] sm:px-8 md:py-8">
        {/* Subtle layered mountain/landscape silhouette – decorative background only */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%]"
          aria-hidden
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 1200 180"
            preserveAspectRatio="xMidYMax slice"
          >
            <defs>
              <filter id="footer-landscape-blur" x="-15%" y="-15%" width="130%" height="130%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              </filter>
            </defs>
            <g filter="url(#footer-landscape-blur)">
              {/* Back layer – lightest, most distant */}
              <path
                fill="#2d4a3e"
                fillOpacity="0.38"
                d="M0 180 L0 115 Q200 85 400 110 T800 95 T1200 115 L1200 180 Z"
              />
              {/* Middle layer */}
              <path
                fill="#243d35"
                fillOpacity="0.45"
                d="M0 180 L0 135 Q250 105 500 135 T1000 120 T1200 145 L1200 180 Z"
              />
              {/* Front layer – darkest, closest to bottom */}
              <path
                fill="#1a3329"
                fillOpacity="0.42"
                d="M0 180 L0 155 Q300 130 600 160 T1200 150 L1200 180 Z"
              />
            </g>
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3 md:gap-6">
            {/* Left column */}
            <div className={`space-y-2 ${rtl ? "text-right md:text-right" : "text-left"}`}>
              <h3 className="text-xl font-semibold tracking-tight text-[#f5f0e6]">
                Explore Oman
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-[#e8e2d6]">
                {t.tagline}
              </p>
            </div>

            {/* Center column - Quick links */}
            <div className={`space-y-2 ${rtl ? "text-right md:text-center" : "text-left md:text-center"}`}>
              <div className="text-xs font-medium uppercase tracking-wider text-[#c9c4b8]">
                Quick Links
              </div>
              <nav className="flex flex-wrap gap-x-4 gap-y-2 md:flex-col md:items-center md:gap-2">
                <Link
                  href={`/${locale}`}
                  className="text-sm text-[#f5f0e6] transition hover:text-[#fff] hover:underline"
                >
                  {t.home}
                </Link>
                <Link
                  href={`/${locale}/destinations`}
                  className="text-sm text-[#f5f0e6] transition hover:text-[#fff] hover:underline"
                >
                  {t.destinations}
                </Link>
                <Link
                  href={`/${locale}/planner`}
                  className="text-sm text-[#f5f0e6] transition hover:text-[#fff] hover:underline"
                >
                  {t.tripPlanner}
                </Link>
                <Link
                  href={`/${locale}/saved`}
                  className="text-sm text-[#f5f0e6] transition hover:text-[#fff] hover:underline"
                >
                  {t.savedPlaces}
                </Link>
              </nav>
            </div>

            {/* Right column - Contact */}
            <div className={`space-y-1.5 ${rtl ? "text-left md:text-right" : "text-right"}`}>
              <div className="text-xs font-medium uppercase tracking-wider text-[#c9c4b8]">
                About
              </div>
              <p className="text-sm text-[#f5f0e6]">{t.builtBy}</p>
              <p className="text-sm text-[#e8e2d6]">{t.role}</p>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="mt-6 border-t border-[#2d4a3e]/60 pt-4 text-center">
            <p className="text-xs text-[#c9c4b8]">
              {t.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
