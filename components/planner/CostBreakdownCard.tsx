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
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h3 className={`text-sm font-semibold text-zinc-900 ${isArabic ? "text-right" : "text-left"}`}>
        {labels.title}
      </h3>
      <div className="grid gap-2 text-sm text-zinc-600 md:grid-cols-2">
        <div>{labels.fuel}: {cost.fuel.toFixed(2)} OMR</div>
        <div>{labels.tickets}: {cost.tickets.toFixed(2)} OMR</div>
        <div>{labels.food}: {cost.food.toFixed(2)} OMR</div>
        <div>{labels.hotel}: {cost.hotel.toFixed(2)} OMR</div>
        <div className="font-semibold text-zinc-900">
          {labels.total}: {cost.total.toFixed(2)} OMR
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
        <div className="space-y-1 text-xs text-zinc-600">
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
