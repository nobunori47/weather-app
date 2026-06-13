import { WeatherApp } from "@/components/WeatherApp";

export default function Home() {
  return (
    <div className="min-h-full bg-gradient-to-b from-sky-500 via-sky-600 to-sky-800 px-4 py-8 sm:px-6 sm:py-12">
      <main className="min-h-full">
        <WeatherApp />
      </main>
    </div>
  );
}
