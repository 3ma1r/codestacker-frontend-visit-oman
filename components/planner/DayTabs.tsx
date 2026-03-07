"use client";

type Props = {
  days: number;
  selectedDay: number;
  onSelect: (dayIndex: number) => void;
  locale: "en" | "ar";
};

export default function DayTabs({ days, selectedDay, onSelect, locale }: Props) {
  if (days === 0) {
    return null;
  }
  const isArabic = locale === "ar";

  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: days }, (_, index) => {
        const dayIndex = index + 1;
        const active = dayIndex === selectedDay;
        return (
          <button
            key={dayIndex}
            type="button"
            onClick={() => onSelect(dayIndex)}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium",
              active
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 text-zinc-600",
            ].join(" ")}
          >
            {isArabic ? "اليوم" : "Day"} {dayIndex}
          </button>
        );
      })}
    </div>
  );
}
