import { NextResponse } from "next/server"
import { getRandomSuggestions } from "@/src/lib/getRandomSuggestion"

export function GET() {
  const suggestions = getRandomSuggestions(3)

  return NextResponse.json({
    success: true,
    suggestions
  })
}
