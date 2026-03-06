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
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dir = getDir(locale);
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? `/${locale}`;
  const switchPath = getSwitchPath(locale, pathname);

  return (
    <div dir={dir} className="min-h-screen bg-white text-zinc-950">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href={`/${locale}`}>Discover</Link>
          <Link href={`/${locale}/destinations`}>Destinations</Link>
          <Link href={`/${locale}/planner`}>Planner</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/planner`}>
            <SavedCounter />
          </Link>
          <Link href={switchPath} className="text-sm font-medium underline">
            {locale === "en" ? "العربية" : "English"}
          </Link>
        </div>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
