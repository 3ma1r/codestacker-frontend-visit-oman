import PlannerShell from "../../../components/planner/PlannerShell";
import type { Locale } from "../../../lib/i18n/locale";

type Props = {
  params: { locale: Locale };
};

export default function PlannerPage({ params }: Props) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Trip planner</h1>
        <p className="text-sm text-zinc-500">
          Set your preferences and generate a deterministic itinerary.
        </p>
      </header>

      <PlannerShell locale={params.locale} />
    </div>
  );
}
