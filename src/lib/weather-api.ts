import type { ForecastResponse, WeatherData } from "@/types/weather";
import { groupForecastByDay, getCurrentPop } from "@/lib/forecast-utils";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

function getApiKey(): string {
  if (!API_KEY) throw new Error("APIキーが設定されていません。");
  return API_KEY;
}

async function fetchWeatherApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (response.status === 404) throw new Error("都市名が見つかりません。別の都市名を入力してください。");
  if (!response.ok) throw new Error("天気情報の取得に失敗しました。");
  return response.json() as Promise<T>;
}

interface RawCurrent {
  name: string;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const trimmedCity = city.trim();
  if (!trimmedCity) throw new Error("都市名を入力してください。");
  const apiKey = getApiKey();
  const params = new URLSearchParams({ q: trimmedCity, appid: apiKey, units: "metric", lang: "ja" });
  const [raw, forecast] = await Promise.all([
    fetchWeatherApi<RawCurrent>(`https://api.openweathermap.org/data/2.5/weather?${params}`),
    fetchWeatherApi<ForecastResponse>(`https://api.openweathermap.org/data/2.5/forecast?${params}`),
  ]);
  const dailyForecasts = groupForecastByDay(forecast.list, forecast.city.timezone);
  return {
    cityName: raw.name,
    current: {
      temp: raw.main.temp,
      humidity: raw.main.humidity,
      description: raw.weather[0]?.description ?? "",
      icon: raw.weather[0]?.icon ?? "01d",
      windSpeed: raw.wind?.speed ?? 0,
    },
    dailyForecasts,
    currentPop: getCurrentPop(forecast.list, forecast.city.timezone),
  };
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
