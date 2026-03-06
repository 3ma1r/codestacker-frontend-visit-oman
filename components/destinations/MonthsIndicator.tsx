import type { Month } from "../../types/destination";

type Props = {
  months: Month[];
};

const ALL_MONTHS: Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function MonthsIndicator({ months }: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {ALL_MONTHS.map((month) => {
        const isActive = months.includes(month);
        return (
          <span
            key={month}
            className={[
              "rounded-full px-2 py-0.5 text-xs",
              isActive
                ? "bg-emerald-600 text-white"
                : "bg-zinc-100 text-zinc-600",
            ].join(" ")}
          >
            {month}
          </span>
        );
      })}
    </div>
  );
}
