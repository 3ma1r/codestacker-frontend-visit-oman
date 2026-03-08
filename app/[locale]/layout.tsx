import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import SavedCounter from "../../components/common/SavedCounter";
import { getDir, isLocale, type Locale } from "../../lib/i18n/locale";

function getSwitchPath(locale: Locale, pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const nextLocale = locale === "en" ? "ar" : "en";

  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  if (segments[0] === "en" || segments[0] === "ar") {
    segments[0] = nextLocale;
    return `/${segments.join("/")}`;
  }

  return `/${nextLocale}${pathname}`;
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const rtl = locale === "ar";

  const dir = getDir(locale);
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? `/${locale}`;
  const switchPath = getSwitchPath(locale, pathname);
  const labels = {
    discover: locale === "ar" ? "الرئيسية" : "Home",
    destinations: locale === "ar" ? "الوجهات" : "Destinations",
    planner: locale === "ar" ? "المخطط" : "Planner",
    language: locale === "ar" ? "English" : "العربية",
  };

  return (
    <div
      dir={dir}
      className={`min-h-screen bg-[#F6F1E7] text-neutral-900 ${rtl ? "rtl" : "ltr"}`}
    >
      <header className="fixed left-0 top-0 z-50 w-full">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div
            className={`flex items-center justify-between rounded-full border border-white/30 bg-white/20 px-6 py-3 shadow-2xl backdrop-blur-xl ${
              rtl ? "flex-row-reverse" : ""
            }`}
          >
            <nav className="flex items-center gap-6 text-base font-semibold text-white">
              <Link
                className="transition hover:text-white/90 hover:underline"
                href={`/${locale}`}
              >
                {labels.discover}
              </Link>
              <Link
                className="transition hover:text-white/90 hover:underline"
                href={`/${locale}/destinations`}
              >
                {labels.destinations}
              </Link>
              <Link
                className="transition hover:text-white/90 hover:underline"
                href={`/${locale}/planner`}
              >
                {labels.planner}
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/saved`}
                className="flex items-center gap-2 rounded-full border border-transparent bg-white/10 px-3 py-1 text-sm font-medium text-white transition hover:bg-white/20"
              >
                <span className="text-sm">❤</span>
                <SavedCounter />
              </Link>
              <Link
                href={switchPath}
                className="rounded-full border border-transparent bg-white/10 px-3 py-1 text-sm font-medium text-white transition hover:bg-white/20"
              >
                {labels.language}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 pb-10 pt-24">{children}</main>
    </div>
  );
}
