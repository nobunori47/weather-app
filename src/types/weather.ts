export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  temp: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  pop: number;
}

export interface DailyForecast {
  dateKey: string;
  dateLabel: string;
  dayOfWeek: string;
  isToday: boolean;
  items: ForecastItem[];
  tempMin: number;
  tempMax: number;
  humidity: number;
  popMax: number;
  icon: string;
  description: string;
}

export interface WeatherData {
  cityName: string;
  current: CurrentWeather;
  dailyForecasts: DailyForecast[];
  currentPop: number;
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    name: string;
    timezone: number;
  };
}
