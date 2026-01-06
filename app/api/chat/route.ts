import { GoogleGenAI } from "@google/genai"

export const runtime = "nodejs"

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY as string,
})

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || !message.trim()) {
      return Response.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      )
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    })

    return Response.json({
      success: true,
      reply: response.text,
    })
  } catch (error) {
    console.error("Gemini chat error:", error)

    return Response.json(
      {
        success: false,
        message: "Gemini failed to respond",
      },
      { status: 500 }
    )
  }
}
