export function getWeatherAdvice(params: {
  temp: number;
  pop: number;
  windSpeed?: number;
}): string[] {
  const { temp, pop, windSpeed = 0 } = params;
  const advice: string[] = [];

  if (pop >= 60) advice.push("☂️ 傘を持っていきましょう");
  if (temp >= 30) advice.push("🌡️ 熱中症に注意！水分補給を忘れずに");
  else if (temp >= 25) advice.push("👕 半袖がおすすめです");
  else if (temp >= 15) advice.push("🧥 長袖か薄手のジャケットがおすすめです");
  else advice.push("🧣 しっかり防寒してください");
  if (windSpeed >= 10) advice.push("💨 強風注意！洗濯物は室内に");

  return advice;
}
