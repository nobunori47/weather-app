"use client";

interface CitySearchProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export function CitySearch({ onSearch, isLoading }: CitySearchProps) {
  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const city = String(formData.get("city") ?? "");
        onSearch(city);
      }}
    >
      <label htmlFor="city-search" className="sr-only">
        都市名
      </label>
      <input
        id="city-search"
        name="city"
        type="text"
        placeholder="都市名を入力（例: Tokyo, 大阪）"
        required
        disabled={isLoading}
        className="min-h-11 flex-1 rounded-xl border border-sky-200 bg-white/90 px-4 text-base text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="min-h-11 min-w-11 rounded-xl bg-sky-600 px-6 text-base font-semibold text-white transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        検索
      </button>
    </form>
  );
}
