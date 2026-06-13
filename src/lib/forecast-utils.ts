import type { DailyForecast, ForecastItem } from "@/types/weather";

function getLocalDateKey(dt: number, timezoneOffset: number): string {
  const localMs = (dt + timezoneOffset) * 1000;
  const date = new Date(localMs);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getLocalDateParts(dt: number, timezoneOffset: number): Date {
  return new Date((dt + timezoneOffset) * 1000);
}

function formatDateLabel(dateKey: string): string {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function formatDayOfWeek(dt: number, timezoneOffset: number): string {
  const date = getLocalDateParts(dt, timezoneOffset);
  return new Intl.DateTimeFormat("ja-JP", {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

function pickRepresentativeItem(
  items: ForecastItem[],
  timezoneOffset: number,
): ForecastItem {
  const midday = items.find((item) => {
    const hour = new Date((item.dt + timezoneOffset) * 1000).getUTCHours();
    return hour >= 11 && hour <= 14;
  });
  return midday ?? items[Math.floor(items.length / 2)] ?? items[0];
}

export function groupForecastByDay(
  list: ForecastItem[],
  timezoneOffset: number,
): DailyForecast[] {
  const todayKey = getLocalDateKey(
    Math.floor(Date.now() / 1000),
    timezoneOffset,
  );

  const grouped = new Map<string, ForecastItem[]>();

  for (const item of list) {
    const dateKey = getLocalDateKey(item.dt, timezoneOffset);
    const existing = grouped.get(dateKey) ?? [];
    existing.push(item);
    grouped.set(dateKey, existing);
  }

  return Array.from(grouped.entries())
    .slice(0, 5)
    .map(([dateKey, items]) => {
      const representative = pickRepresentativeItem(items, timezoneOffset);
      const temps = items.map((item) => item.main.temp);
      const humidities = items.map((item) => item.main.humidity);
      const pops = items.map((item) => item.pop);

      return {
        dateKey,
        dateLabel: formatDateLabel(dateKey),
        dayOfWeek: formatDayOfWeek(representative.dt, timezoneOffset),
        isToday: dateKey === todayKey,
        items,
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        humidity: Math.round(
          humidities.reduce((sum, value) => sum + value, 0) / humidities.length,
        ),
        popMax: Math.round(Math.max(...pops) * 100),
        icon: representative.weather[0]?.icon ?? "01d",
        description: representative.weather[0]?.description ?? "",
      };
    });
}

export function getCurrentPop(
  list: ForecastItem[],
  timezoneOffset: number,
): number {
  const now = Math.floor(Date.now() / 1000);
  const todayKey = getLocalDateKey(now, timezoneOffset);

  const todayItems = list.filter(
    (item) => getLocalDateKey(item.dt, timezoneOffset) === todayKey,
  );

  if (todayItems.length === 0) {
    return Math.round((list[0]?.pop ?? 0) * 100);
  }

  const nearest =
    todayItems.reduce((closest, item) => {
      const closestDiff = Math.abs(closest.dt - now);
      const itemDiff = Math.abs(item.dt - now);
      return itemDiff < closestDiff ? item : closest;
    }) ?? todayItems[0];

  return Math.round(nearest.pop * 100);
}
