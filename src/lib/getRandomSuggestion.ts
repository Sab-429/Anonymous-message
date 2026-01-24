import suggestions from "@/src/data/suggestion"

export function getRandomSuggestions(count = 3) {
  if (!suggestions.length) return []

  const shuffled = [...suggestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
