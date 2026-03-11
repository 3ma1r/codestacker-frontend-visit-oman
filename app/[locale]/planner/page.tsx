import PlannerShell from "../../../components/planner/PlannerShell";
import { isLocale, type Locale } from "../../../lib/i18n/locale";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function PlannerPage({ params }: Props) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section
        className="relative left-1/2 right-1/2 -mx-[50vw] -mt-24 w-screen overflow-hidden"
        style={{
          backgroundImage: "url('/oman3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/25" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <div className="relative px-8 pb-24 pt-36 md:pb-28 md:pt-40">
          <div className={`mx-auto max-w-6xl ${isArabic ? "text-right" : "text-left"}`}>
            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                {isArabic ? "خطط لرحلتك بثقة" : "Plan your Oman journey"}
              </h1>
              <p className="text-sm text-white/85 sm:text-base">
                {isArabic
                  ? "اضبط تفضيلاتك وأنشئ خطة رحلة محددة."
                  : "Set your preferences and generate a deterministic itinerary."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <PlannerShell locale={locale} />
    </div>
  );
}
