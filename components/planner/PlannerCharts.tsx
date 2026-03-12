"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Locale } from "../../lib/i18n/locale";
import type { Destination } from "../../types/destination";
import type { PlannerResult } from "../../types/planner";
import {
  FOOD_OMR_PER_DAY,
  FUEL_OMR_PER_KM,
  HOTEL_OMR_PER_NIGHT,
  budgetThreshold,
  round2,
} from "../../lib/cost/calc";

type Props = {
  result: PlannerResult;
  destinationsById: Map<string, Destination>;
  locale: Locale;
};

const PIE_COLORS = ["#9aa7a1", "#d7c3a6", "#c6b5a6", "#b8c4cc"];
const BAR_COLORS = ["#b58c6f", "#d2b08f", "#94a892", "#9db2c2", "#c7b89c"];

export default function PlannerCharts({
  result,
  destinationsById,
  locale,
}: Props) {
  const isArabic = locale === "ar";
  const threshold = budgetThreshold(result.inputs.budget, result.inputs.days);
  const withinBudget = result.overBudgetBy <= 0;

  const pieData = useMemo(
    () => [
      { name: isArabic ? "الإقامة" : "Hotel", value: result.cost.hotel },
      { name: isArabic ? "الطعام" : "Food", value: result.cost.food },
      { name: isArabic ? "الوقود" : "Fuel", value: result.cost.fuel },
      { name: isArabic ? "التذاكر" : "Tickets", value: result.cost.tickets },
    ],
    [isArabic, result.cost],
  );

  const dailyData = useMemo(() => {
    const daysCount = result.days.length;
    const hotelPerNight = HOTEL_OMR_PER_NIGHT[result.inputs.budget];
    return result.days.map((day, index) => {
      const destinations = day.routeDestinationIds
        .map((id) => destinationsById.get(id))
        .filter((destination): destination is Destination => Boolean(destination));
      const tickets = destinations.reduce(
        (sum, destination) => sum + destination.ticket_cost_omr,
        0,
      );
      const fuel = day.dayPlan.totalKm * FUEL_OMR_PER_KM;
      const food = FOOD_OMR_PER_DAY;
      const hotel = index < daysCount - 1 ? hotelPerNight : 0;
      const total = round2(tickets + fuel + food + hotel);
      return {
        index,
        label: isArabic ? `اليوم ${index + 1}` : `Day ${index + 1}`,
        value: total,
      };
    });
  }, [destinationsById, isArabic, result]);

  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const totalCost = result.cost.total || 1;

  const activePie =
    activePieIndex !== null ? pieData[activePieIndex] : undefined;
  const activeBar =
    activeBarIndex !== null ? dailyData[activeBarIndex] : undefined;

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
      <div className="flex h-full flex-col rounded-3xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-zinc-900">
            {isArabic ? "تفصيل الميزانية" : "Budget Breakdown"}
          </div>
          <div className="text-2xl font-semibold text-zinc-900">
            {result.cost.total.toFixed(2)} OMR
          </div>
          <div className="text-xs text-zinc-500">
            {withinBudget
              ? isArabic
                ? "ضمن الميزانية"
                : "Within budget"
              : isArabic
                ? "تجاوز الميزانية"
                : "Over budget"}
          </div>
        </div>

        <div className="mt-3 flex-1">
          <div className="flex items-center gap-4">
            <div className="flex min-w-[52%] flex-1 items-center justify-center">
              <div className="flex w-full justify-center">
                <ResponsiveContainer width="100%" height={180}>
                <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={68}
                    innerRadius={40}
                    paddingAngle={3}
                    onClick={(_, index) => setActivePieIndex(index)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex min-w-[40%] flex-1 items-center justify-start">
              <ul className="space-y-1 text-xs text-zinc-600">
                {pieData.map((entry, index) => (
                  <li key={entry.name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span>{entry.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {activePie ? (
          <div className="mt-1 text-xs text-zinc-600">
            {activePie.name}: {activePie.value.toFixed(2)} OMR ·{" "}
            {Math.round((activePie.value / totalCost) * 100)}%
          </div>
        ) : null}

        <div className="mt-2 text-xs text-zinc-600">
          <div>
            {isArabic ? "الإجمالي" : "Total"}: {result.cost.total.toFixed(2)} OMR
          </div>
          <div>
            {isArabic ? "الحد" : "Threshold"}: {threshold.toFixed(2)} OMR
          </div>
          <div className={withinBudget ? "text-emerald-600" : "text-rose-600"}>
            {withinBudget
              ? isArabic
                ? "ضمن الميزانية"
                : "Within budget"
              : isArabic
                ? "تجاوز الميزانية"
                : "Over budget"}
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col rounded-3xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-zinc-900">
            {isArabic ? "التكلفة اليومية" : "Daily Cost"}
          </div>
          <div className="text-xs text-zinc-500">
            {isArabic ? "متوسط يومي" : "Average per day"}{" "}
            {round2(result.cost.total / result.days.length).toFixed(2)} OMR
          </div>
        </div>

        <div className="mt-10 flex-1">
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={dailyData} barCategoryGap={12}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Bar
                dataKey="value"
                barSize={30}
                radius={[6, 6, 0, 0]}
                onClick={(_, index) => setActiveBarIndex(index)}
              >
                {dailyData.map((entry, index) => {
                  const isActive = activeBarIndex === index;
                  const dimmed = activeBarIndex !== null && !isActive;
                  return (
                  <Cell
                    key={entry.label}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                    fillOpacity={dimmed ? 0.45 : 1}
                    stroke={isActive ? "#0f172a" : "transparent"}
                    strokeWidth={isActive ? 1 : 0}
                  />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {activeBar ? (
          <div className="mt-1 text-xs text-zinc-600">
            {activeBar.label}: {activeBar.value.toFixed(2)} OMR ·{" "}
            {Math.round((activeBar.value / totalCost) * 100)}%
          </div>
        ) : null}
      </div>
    </div>
  );
}
