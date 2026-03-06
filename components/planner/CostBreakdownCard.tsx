import type { CostBreakdown, PlannerInputs } from "../../types/planner";
import { budgetThreshold } from "../../lib/cost/calc";

type Props = {
  cost: CostBreakdown;
  inputs: PlannerInputs;
  overBudgetBy: number;
  adjustments: string[];
};

export default function CostBreakdownCard({
  cost,
  inputs,
  overBudgetBy,
  adjustments,
}: Props) {
  const threshold = budgetThreshold(inputs.budget, inputs.days);

  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-zinc-900">Cost breakdown</h3>
      <div className="grid gap-2 text-sm text-zinc-600 md:grid-cols-2">
        <div>Fuel: {cost.fuel.toFixed(2)} OMR</div>
        <div>Tickets: {cost.tickets.toFixed(2)} OMR</div>
        <div>Food: {cost.food.toFixed(2)} OMR</div>
        <div>Hotel: {cost.hotel.toFixed(2)} OMR</div>
        <div className="font-semibold text-zinc-900">
          Total: {cost.total.toFixed(2)} OMR
        </div>
        <div className="text-xs text-zinc-500">
          Threshold ({inputs.budget}): {threshold.toFixed(2)} OMR
        </div>
      </div>
      {overBudgetBy > 0 ? (
        <p className="text-xs font-medium text-rose-600">
          Over budget by {overBudgetBy.toFixed(2)} OMR
        </p>
      ) : (
        <p className="text-xs font-medium text-emerald-600">
          Within budget.
        </p>
      )}

      {adjustments.length > 0 && (
        <div className="space-y-1 text-xs text-zinc-600">
          <div className="font-medium text-zinc-800">Adjustments</div>
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
