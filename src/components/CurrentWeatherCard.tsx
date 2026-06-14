import { WeatherIcon } from "@/components/WeatherIcon";
import type { CurrentWeather } from "@/types/weather";

interface CurrentWeatherCardProps {
  cityName: string;
  current: CurrentWeather;
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

export function CurrentWeatherCard({ cityName, current, pop }: CurrentWeatherCardProps) {
  return (
    <section className="rounded-2xl bg-white/95 p-6 shadow-lg shadow-sky-900/10">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base text-slate-500">現在の天気</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">{cityName}</h2>
          <p className="mt-2 text-lg capitalize text-slate-600">{current.description}</p>
        </div>
        <WeatherIcon icon={current.icon} description={current.description} />
      </div>
      <p className="mt-6 text-center text-6xl font-bold text-slate-900 sm:text-left">
        {Math.round(current.temp)}°C
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatItem label="天気" value={current.description} />
        <StatItem label="湿度" value={`${current.humidity}%`} />
        <StatItem label="降水確率" value={`${pop}%`} />
      </div>
    </section>
  );
}
