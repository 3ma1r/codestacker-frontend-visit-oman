import type { RegionAllocation } from "../../types/planner";

type Props = {
  allocation: RegionAllocation[];
  locale: "en" | "ar";
};

export default function RegionAllocationSummary({ allocation, locale }: Props) {
  const isArabic = locale === "ar";
  const title = isArabic ? "توزيع المناطق:" : "Region allocation:";
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
      className={`rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 ${
        isArabic ? "text-right" : "text-left"
      }`}
    >
      <span className="font-medium text-zinc-900">{title}</span>{" "}
      {allocation
        .map(
          (item) =>
            `${item.region} ×${item.days} ${
              item.days > 1 ? dayLabelPlural : dayLabel
            }`,
        )
        .join(", ")}
    </div>
  );
}
