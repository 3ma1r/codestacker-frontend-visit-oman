import type { CostBreakdown, PlannerInputs } from "../../types/planner";
import { budgetThreshold } from "../../lib/cost/calc";

type Props = {
  cost: CostBreakdown;
  inputs: PlannerInputs;
  overBudgetBy: number;
  adjustments: string[];
  locale: "en" | "ar";
};

export default function CostBreakdownCard({
  cost,
  inputs,
  overBudgetBy,
  adjustments,
  locale,
}: Props) {
  const isArabic = locale === "ar";
  const labels = {
    title: isArabic ? "تفصيل التكلفة" : "Cost breakdown",
    fuel: isArabic ? "الوقود" : "Fuel",
    tickets: isArabic ? "التذاكر" : "Tickets",
    food: isArabic ? "الطعام" : "Food",
    hotel: isArabic ? "الإقامة" : "Hotel",
    total: isArabic ? "الإجمالي" : "Total",
    threshold: isArabic ? "الحد" : "Threshold",
    overBudget: isArabic ? "تجاوز الميزانية بمقدار" : "Over budget by",
    withinBudget: isArabic ? "ضمن الميزانية." : "Within budget.",
    adjustments: isArabic ? "التعديلات" : "Adjustments",
  };
  const threshold = budgetThreshold(inputs.budget, inputs.days);

  return (
    <div className="space-y-4 rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-semibold text-zinc-900 ${isArabic ? "text-right" : "text-left"}`}>
          {labels.title}
        </h3>
        <span className="text-xs text-zinc-400">OMR</span>
      </div>
      <div className="grid gap-3 text-sm text-zinc-600">
        <div className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
          <span>{labels.fuel}</span>
          <span className="font-medium text-zinc-800">{cost.fuel.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
          <span>{labels.tickets}</span>
          <span className="font-medium text-zinc-800">{cost.tickets.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
          <span>{labels.food}</span>
          <span className="font-medium text-zinc-800">{cost.food.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 shadow-sm">
          <span>{labels.hotel}</span>
          <span className="font-medium text-zinc-800">{cost.hotel.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-zinc-900 px-3 py-2 text-white shadow-sm">
          <span className="font-semibold">{labels.total}</span>
          <span className="font-semibold">{cost.total.toFixed(2)}</span>
        </div>
        <div className="text-xs text-zinc-500">
          {labels.threshold} ({inputs.budget}): {threshold.toFixed(2)} OMR
        </div>
      </div>
      {overBudgetBy > 0 ? (
        <p className="text-xs font-medium text-rose-600">
          {labels.overBudget} {overBudgetBy.toFixed(2)} OMR
        </p>
      ) : (
        <p className="text-xs font-medium text-emerald-600">
          {labels.withinBudget}
        </p>
      )}

      {adjustments.length > 0 && (
        <div className="space-y-2 text-xs text-zinc-600">
          <div className="font-medium text-zinc-800">{labels.adjustments}</div>
          <ul className="list-disc pl-5">
            {adjustments.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
