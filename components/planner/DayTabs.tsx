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
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur">
      {Array.from({ length: days }, (_, index) => {
        const dayIndex = index + 1;
        const active = dayIndex === selectedDay;
        return (
          <button
            key={dayIndex}
            type="button"
            onClick={() => onSelect(dayIndex)}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium transition",
              active
                ? "bg-zinc-900 text-white shadow-sm"
                : "bg-white text-zinc-600 hover:bg-white/70",
            ].join(" ")}
          >
            {isArabic ? "اليوم" : "Day"} {dayIndex}
          </button>
        );
      })}
    </div>
  );
}
