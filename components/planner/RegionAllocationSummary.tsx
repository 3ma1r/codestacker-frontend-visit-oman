import type { RegionAllocation } from "../../types/planner";

type Props = {
  allocation: RegionAllocation[];
  locale: "en" | "ar";
};

export default function RegionAllocationSummary({ allocation, locale }: Props) {
  const isArabic = locale === "ar";
  const title = isArabic ? "ملخص الرحلة" : "Trip summary";
  if (allocation.length === 0) {
    return (
      <p className={`text-sm text-zinc-500 ${isArabic ? "text-right" : "text-left"}`}>
        {isArabic ? "لا يوجد توزيع للمناطق." : "No region allocation."}
      </p>
    );
  }

  const dayLabel = isArabic ? "يوم" : "day";
  const dayLabelPlural = isArabic ? "أيام" : "days";

  return (
    <div
      className={`rounded-3xl border border-white/60 bg-white/80 p-5 text-sm text-zinc-700 shadow-sm backdrop-blur ${
        isArabic ? "text-right" : "text-left"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-900">{title}</span>
        <span className="text-xs text-zinc-400">
          {isArabic ? "الأيام" : "Days"}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {allocation.map((item) => (
          <div
            key={item.region}
            className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 text-xs text-zinc-700 shadow-sm"
          >
            <span className="font-medium text-zinc-900">{item.region}</span>
            <span>
              {item.days} {item.days > 1 ? dayLabelPlural : dayLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
