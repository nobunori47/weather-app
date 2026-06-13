"use client";

import { useState } from "react";
import { CitySearch } from "@/components/CitySearch";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { DayCalendar } from "@/components/DayCalendar";
import { DayForecastCard } from "@/components/DayForecastCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { fetchWeatherByCity } from "@/lib/weather-api";
import type { WeatherData } from "@/types/weather";

export function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(city: string) {
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
      setError(
        err instanceof Error ? err.message : "予期しないエラーが発生しました。",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const selectedDay = weatherData?.dailyForecasts.find(
    (day) => day.dateKey === selectedDateKey,
  );
  const showCurrentWeather = selectedDay?.isToday ?? false;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          天気予報
        </h1>
        <p className="mt-2 text-base text-white/80">
          都市名を入力して、現在の天気と5日間の予報を確認できます
        </p>
      </header>

      <CitySearch onSearch={handleSearch} isLoading={isLoading} />

      {error && <ErrorMessage message={error} />}

      {isLoading && <LoadingSpinner />}

      {!isLoading && weatherData && (
        <div className="flex flex-col gap-6">
          {showCurrentWeather ? (
            <CurrentWeatherCard
              cityName={weatherData.cityName}
              current={weatherData.current}
              pop={weatherData.currentPop}
            />
          ) : selectedDay ? (
            <DayForecastCard
              cityName={weatherData.cityName}
              forecast={selectedDay}
            />
          ) : null}

          <DayCalendar
            days={weatherData.dailyForecasts}
            selectedDateKey={selectedDateKey}
            onSelect={setSelectedDateKey}
          />
        </div>
      )}

      {!isLoading && !weatherData && !error && (
        <p className="rounded-2xl bg-white/20 px-6 py-8 text-center text-base text-white/90">
          都市名を検索すると、ここに天気情報が表示されます
        </p>
      )}
    </div>
  );
}
