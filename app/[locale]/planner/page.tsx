import PlannerShell from "../../../components/planner/PlannerShell";
import { isLocale, type Locale } from "../../../lib/i18n/locale";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function PlannerPage({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Trip planner</h1>
        <p className="text-sm text-zinc-500">
          Set your preferences and generate a deterministic itinerary.
        </p>
      </header>

      <PlannerShell locale={locale} />
    </div>
  );
}
