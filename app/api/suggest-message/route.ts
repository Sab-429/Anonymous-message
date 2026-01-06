import { GoogleGenAI } from "@google/genai"

export const runtime = "nodejs"

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY as string,
})

export async function GET() {
  try {
    const prompt = `
Generate exactly 3 open-ended, friendly, anonymous questions.
- Suitable for a public anonymous messaging platform
- Avoid personal, political, religious, or sensitive topics
- Do NOT number the questions
- Do NOT add emojis
- Return them as ONE single line
- Separate each question strictly with "||"

Example format:
Question one?||Question two?||Question three?
`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    return Response.json({
      success: true,
      reply: response.text?.trim(),
    })
  } catch (error: unknown) {
    console.error("Gemini error:", error)

    return Response.json(
      {
        success: false,
        message: "Failed to generate suggested messages",
      },
      { status: 500 }
    )
  }
}
