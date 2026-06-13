export function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="読み込み中"
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
      <p className="text-base text-white/90">天気情報を取得しています...</p>
    </div>
  );
}
