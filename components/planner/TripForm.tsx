"use client";

import type { BudgetTier, Intensity, PlannerInputs } from "../../types/planner";
import type { Category } from "../../types/destination";

type Props = {
  value: PlannerInputs;
  availableCategories: Category[];
  onChange: (next: PlannerInputs) => void;
  onSubmit: (inputs: PlannerInputs) => void;
};

const DAYS = [1, 2, 3, 4, 5, 6, 7] as const;
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export default function TripForm({
  value,
  availableCategories,
  onChange,
  onSubmit,
}: Props) {
  const update = (patch: Partial<PlannerInputs>) => {
    onChange({ ...value, ...patch });
  };

  const toggleCategory = (category: Category) => {
    const exists = value.preferredCategories.includes(category);
    update({
      preferredCategories: exists
        ? value.preferredCategories.filter((item) => item !== category)
        : [...value.preferredCategories, category],
    });
  };

  return (
    <form
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
          Days
          <select
            value={value.days}
            onChange={(event) =>
              update({ days: Number(event.target.value) as PlannerInputs["days"] })
            }
            className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-900"
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
          Month
          <select
            value={value.month}
            onChange={(event) =>
              update({ month: Number(event.target.value) as PlannerInputs["month"] })
            }
            className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-900"
          >
            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
          Budget
          <select
            value={value.budget}
            onChange={(event) =>
              update({ budget: event.target.value as BudgetTier })
            }
            className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-900"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="luxury">luxury</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
          Intensity
          <select
            value={value.intensity}
            onChange={(event) =>
              update({ intensity: event.target.value as Intensity })
            }
            className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-900"
          >
            <option value="relaxed">relaxed</option>
            <option value="balanced">balanced</option>
            <option value="packed">packed</option>
          </select>
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-600">
          Preferred categories
        </p>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((category) => {
            const active = value.preferredCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={[
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  active
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-zinc-200 text-zinc-600",
                ].join(" ")}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Generate plan
      </button>
    </form>
  );
}
