"use client";
import { useState, useEffect, useCallback } from "react";
import { CitySearch } from "@/components/CitySearch";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { DayCalendar } from "@/components/DayCalendar";
import { DayForecastCard } from "@/components/DayForecastCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { fetchWeatherByCity } from "@/lib/weather-api";
import { getWeatherAdvice } from "@/lib/advice";
import type { WeatherData } from "@/types/weather";

const FAVORITES_KEY = "weather-favorites";

export function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<WeatherData[]>([]);
  const [compareLoading, setCompareLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  const saveFavorites = (list: string[]) => {
    setFavorites(list);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  };

  const toggleFavorite = (city: string) => {
    if (favorites.includes(city)) {
      saveFavorites(favorites.filter((f) => f !== city));
    } else {
      saveFavorites([...favorites, city]);
    }
  };

  const handleSearch = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCity(city);
      setWeatherData(data);
      const today = data.dailyForecasts.find((day) => day.isToday);
      setSelectedDateKey(today?.dateKey ?? data.dailyForecasts[0]?.dateKey ?? "");
    } catch (err) {
      setWeatherData(null);
      setSelectedDateKey("");
      setError(err instanceof Error ? err.message : "予期しないエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCompareCity = async (city: string) => {
    if (compareList.length >= 3) return;
    setCompareLoading(true);
    try {
      const data = await fetchWeatherByCity(city);
      setCompareList((prev) => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
    } finally {
      setCompareLoading(false);
    }
  };

  const selectedDay = weatherData?.dailyForecasts.find((day) => day.dateKey === selectedDateKey);
  const showCurrentWeather = selectedDay?.isToday ?? false;
  const adviceList = weatherData
    ? getWeatherAdvice({ temp: weatherData.current.temp, pop: weatherData.currentPop, windSpeed: weatherData.current.windSpeed })
    : [];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">天気予報</h1>
        <p className="mt-2 text-base text-white/80">都市名を入力して、現在の天気と5日間の予報を確認できます</p>
      </header>

      {favorites.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {favorites.map((city) => (
            <button key={city} onClick={() => compareMode ? addCompareCity(city) : handleSearch(city)}
              className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-colors">
              ⭐ {city}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => { setCompareMode((v) => !v); setCompareList([]); }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${compareMode ? "bg-yellow-400 text-yellow-900" : "bg-white/20 text-white hover:bg-white/30"}`}>
          {compareMode ? "🔄 比較モード ON" : "比較モードで見る"}
        </button>
      </div>

      {compareMode ? (
        <div className="flex flex-col gap-4">
          {compareList.length < 3 && <CitySearch onSearch={addCompareCity} isLoading={compareLoading} />}
          {compareList.length === 0 && (
            <p className="rounded-2xl bg-white/20 px-6 py-8 text-center text-base text-white/90">都市名を入力して比較（最大3都市）</p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {compareList.map((d) => (
              <div key={d.cityName} className="relative rounded-2xl bg-white/90 p-4 text-center shadow">
                <button onClick={() => setCompareList((prev) => prev.filter((x) => x.cityName !== d.cityName))}
                  className="absolute right-2 top-2 text-zinc-400 hover:text-red-500 text-lg">×</button>
                <p className="font-bold text-zinc-800 text-lg">{d.cityName}</p>
                <p className="text-4xl font-bold text-zinc-900">{Math.round(d.current.temp)}°C</p>
                <p className="text-zinc-600">{d.current.description}</p>
                <p className="text-sm text-zinc-500">湿度 {d.current.humidity}%</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <CitySearch onSearch={handleSearch} isLoading={isLoading} />
          {error && <ErrorMessage message={error} />}
          {isLoading && <LoadingSpinner />}
          {!isLoading && weatherData && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <button onClick={() => toggleFavorite(weatherData.cityName)}
                  className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-colors">
                  {favorites.includes(weatherData.cityName) ? "★ お気に入り済み" : "⭐ お気に入りに追加"}
                </button>
              </div>
              {showCurrentWeather ? (
                <CurrentWeatherCard cityName={weatherData.cityName} current={weatherData.current} pop={weatherData.currentPop} />
              ) : selectedDay ? (
                <DayForecastCard cityName={weatherData.cityName} forecast={selectedDay} />
              ) : null}
              {adviceList.length > 0 && (
                <div className="rounded-2xl bg-white/20 px-6 py-4">
                  <p className="mb-2 text-sm font-semibold text-white/80">今日のアドバイス</p>
                  <ul className="flex flex-col gap-1">
                    {adviceList.map((a, i) => <li key={i} className="text-base text-white">{a}</li>)}
                  </ul>
                </div>
              )}
              <DayCalendar days={weatherData.dailyForecasts} selectedDateKey={selectedDateKey} onSelect={setSelectedDateKey} />
            </div>
          )}
          {!isLoading && !weatherData && !error && (
            <p className="rounded-2xl bg-white/20 px-6 py-8 text-center text-base text-white/90">都市名を検索すると、ここに天気情報が表示されます</p>
          )}
        </>
      )}
    </div>
  );
}
