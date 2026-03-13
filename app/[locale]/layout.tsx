import { headers } from "next/headers";
import { notFound } from "next/navigation";
import HeaderBar from "../../components/common/HeaderBar";
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
      <HeaderBar
        locale={locale}
        rtl={rtl}
        switchPath={switchPath}
        labels={labels}
      />
      <main className="mx-auto max-w-6xl px-6 pb-10 pt-24">{children}</main>
    </div>
  );
}
