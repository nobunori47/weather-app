import { WeatherIcon } from "@/components/WeatherIcon";
import type { CurrentWeatherResponse } from "@/types/weather";

interface CurrentWeatherCardProps {
  cityName: string;
  current: CurrentWeatherResponse;
  pop: number;
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-sky-50 px-4 py-3 text-center">
      <p className="text-base text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export function CurrentWeatherCard({
  cityName,
  current,
  pop,
}: CurrentWeatherCardProps) {
  const condition = current.weather[0];

  return (
    <section className="rounded-2xl bg-white/95 p-6 shadow-lg shadow-sky-900/10">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base text-slate-500">現在の天気</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">{cityName}</h2>
          <p className="mt-2 text-lg capitalize text-slate-600">
            {condition?.description ?? "—"}
          </p>
        </div>
        {condition && (
          <WeatherIcon
            icon={condition.icon}
            description={condition.description}
          />
        )}
      </div>

      <p className="mt-6 text-center text-6xl font-bold text-slate-900 sm:text-left">
        {Math.round(current.main.temp)}°C
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatItem label="天気" value={condition?.main ?? "—"} />
        <StatItem label="湿度" value={`${current.main.humidity}%`} />
        <StatItem label="降水確率" value={`${pop}%`} />
      </div>
    </section>
  );
}
