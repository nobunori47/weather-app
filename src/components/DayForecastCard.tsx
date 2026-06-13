import { WeatherIcon } from "@/components/WeatherIcon";
import type { DailyForecast } from "@/types/weather";

interface DayForecastCardProps {
  cityName: string;
  forecast: DailyForecast;
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-sky-50 px-4 py-3 text-center">
      <p className="text-base text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export function DayForecastCard({ cityName, forecast }: DayForecastCardProps) {
  return (
    <section className="rounded-2xl bg-white/95 p-6 shadow-lg shadow-sky-900/10">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base text-slate-500">
            {forecast.dayOfWeek} {forecast.dateLabel} の予報
          </p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">{cityName}</h2>
          <p className="mt-2 text-lg capitalize text-slate-600">
            {forecast.description}
          </p>
        </div>
        <WeatherIcon icon={forecast.icon} description={forecast.description} />
      </div>

      <p className="mt-6 text-center text-5xl font-bold text-slate-900 sm:text-left">
        {forecast.tempMin}°C 〜 {forecast.tempMax}°C
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatItem label="最低気温" value={`${forecast.tempMin}°C`} />
        <StatItem label="最高気温" value={`${forecast.tempMax}°C`} />
        <StatItem label="湿度" value={`${forecast.humidity}%`} />
        <StatItem label="降水確率" value={`${forecast.popMax}%`} />
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-base font-semibold text-slate-700">
          時間別予報
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {forecast.items.map((item) => {
            const time = item.dt_txt.split(" ")[1]?.slice(0, 5) ?? "";
            return (
              <div
                key={item.dt}
                className="min-w-20 shrink-0 rounded-xl bg-sky-50 px-3 py-3 text-center"
              >
                <p className="text-base text-slate-500">{time}</p>
                {item.weather[0] && (
                  <WeatherIcon
                    icon={item.weather[0].icon}
                    description={item.weather[0].description}
                    size="sm"
                  />
                )}
                <p className="text-base font-semibold text-slate-800">
                  {Math.round(item.main.temp)}°
                </p>
                <p className="text-base text-sky-600">
                  {Math.round(item.pop * 100)}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
