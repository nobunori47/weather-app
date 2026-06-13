"use client";

import { WeatherIcon } from "@/components/WeatherIcon";
import type { DailyForecast } from "@/types/weather";

interface DayCalendarProps {
  days: DailyForecast[];
  selectedDateKey: string;
  onSelect: (dateKey: string) => void;
}

export function DayCalendar({
  days,
  selectedDateKey,
  onSelect,
}: DayCalendarProps) {
  return (
    <section
      aria-label="5日間の予報カレンダー"
      className="rounded-2xl bg-white/95 p-4 shadow-lg shadow-sky-900/10"
    >
      <h3 className="mb-4 text-lg font-semibold text-slate-800">5日間予報</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {days.map((day) => {
          const isSelected = day.dateKey === selectedDateKey;

          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => onSelect(day.dateKey)}
              aria-pressed={isSelected}
              aria-label={`${day.dayOfWeek} ${day.dateLabel} の予報を表示`}
              className={`flex min-h-11 flex-col items-center justify-center rounded-xl border-2 px-2 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 ${
                isSelected
                  ? "border-sky-500 bg-sky-500 text-white"
                  : "border-sky-100 bg-sky-50 text-slate-700 hover:border-sky-300 hover:bg-sky-100"
              }`}
            >
              <span className="text-base font-semibold">
                {day.isToday ? "今日" : day.dayOfWeek}
              </span>
              <span className="mt-1 text-base">{day.dateLabel}</span>
              <WeatherIcon
                icon={day.icon}
                description={day.description}
                size="sm"
              />
              <span
                className={`mt-1 text-base font-medium ${
                  isSelected ? "text-white" : "text-slate-600"
                }`}
              >
                {day.tempMin}° / {day.tempMax}°
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
