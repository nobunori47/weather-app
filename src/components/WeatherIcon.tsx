import { getWeatherIconUrl } from "@/lib/weather-api";

interface WeatherIconProps {
  icon: string;
  description: string;
  size?: "sm" | "lg";
}

export function WeatherIcon({
  icon,
  description,
  size = "lg",
}: WeatherIconProps) {
  const dimension = size === "lg" ? 96 : 48;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getWeatherIconUrl(icon)}
      alt={description}
      width={dimension}
      height={dimension}
      className={size === "lg" ? "h-24 w-24" : "h-12 w-12"}
    />
  );
}
