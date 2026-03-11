"use client";

import type { BudgetTier, Intensity, PlannerInputs } from "../../types/planner";
import type { Category } from "../../types/destination";

type Props = {
  value: PlannerInputs;
  availableCategories: Category[];
  onChange: (next: PlannerInputs) => void;
  onSubmit: (inputs: PlannerInputs) => void;
  locale: "en" | "ar";
};

const DAYS = [1, 2, 3, 4, 5, 6, 7] as const;
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export default function TripForm({
  value,
  availableCategories,
  onChange,
  onSubmit,
  locale,
}: Props) {
  const isArabic = locale === "ar";
  const labels = {
    days: isArabic ? "الأيام" : "Days",
    month: isArabic ? "الشهر" : "Month",
    budget: isArabic ? "الميزانية" : "Budget",
    intensity: isArabic ? "الوتيرة" : "Intensity",
    categories: isArabic ? "التصنيفات المفضلة" : "Preferred categories",
    generate: isArabic ? "أنشئ الخطة" : "Generate plan",
    low: isArabic ? "اقتصادي" : "low",
    medium: isArabic ? "متوسط" : "medium",
    luxury: isArabic ? "فاخر" : "luxury",
    relaxed: isArabic ? "مريح" : "relaxed",
    balanced: isArabic ? "متوازن" : "balanced",
    packed: isArabic ? "مكثف" : "packed",
  };
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
      className="space-y-5 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <div className={`flex items-center justify-between ${isArabic ? "flex-row-reverse" : ""}`}>
        <div className="text-sm font-semibold text-zinc-900">
          {isArabic ? "تفاصيل الرحلة" : "Trip details"}
        </div>
        <div className="text-xs text-zinc-500">
          {isArabic ? "حدد تفضيلاتك" : "Set your preferences"}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className={`flex flex-col gap-2 rounded-2xl bg-white/80 p-3 shadow-sm ${isArabic ? "text-right" : "text-left"}`}>
          <span className="text-xs font-medium text-zinc-500">{labels.days}</span>
          <select
            value={value.days}
            onChange={(event) =>
              update({ days: Number(event.target.value) as PlannerInputs["days"] })
            }
            className={`rounded-xl border border-transparent bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 focus:border-zinc-300 focus:outline-none ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <label className={`flex flex-col gap-2 rounded-2xl bg-white/80 p-3 shadow-sm ${isArabic ? "text-right" : "text-left"}`}>
          <span className="text-xs font-medium text-zinc-500">{labels.month}</span>
          <select
            value={value.month}
            onChange={(event) =>
              update({ month: Number(event.target.value) as PlannerInputs["month"] })
            }
            className={`rounded-xl border border-transparent bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 focus:border-zinc-300 focus:outline-none ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <label className={`flex flex-col gap-2 rounded-2xl bg-white/80 p-3 shadow-sm ${isArabic ? "text-right" : "text-left"}`}>
          <span className="text-xs font-medium text-zinc-500">{labels.budget}</span>
          <select
            value={value.budget}
            onChange={(event) =>
              update({ budget: event.target.value as BudgetTier })
            }
            className={`rounded-xl border border-transparent bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 focus:border-zinc-300 focus:outline-none ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <option value="low">{labels.low}</option>
            <option value="medium">{labels.medium}</option>
            <option value="luxury">{labels.luxury}</option>
          </select>
        </label>

        <label className={`flex flex-col gap-2 rounded-2xl bg-white/80 p-3 shadow-sm ${isArabic ? "text-right" : "text-left"}`}>
          <span className="text-xs font-medium text-zinc-500">{labels.intensity}</span>
          <select
            value={value.intensity}
            onChange={(event) =>
              update({ intensity: event.target.value as Intensity })
            }
            className={`rounded-xl border border-transparent bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 focus:border-zinc-300 focus:outline-none ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <option value="relaxed">{labels.relaxed}</option>
            <option value="balanced">{labels.balanced}</option>
            <option value="packed">{labels.packed}</option>
          </select>
        </label>
      </div>

      <div className="space-y-3">
        <p className={`text-xs font-medium text-zinc-600 ${isArabic ? "text-right" : "text-left"}`}>
          {labels.categories}
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
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  active
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-600",
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
        className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-800"
      >
        {labels.generate}
      </button>
    </form>
  );
}
