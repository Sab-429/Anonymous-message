import { RateLimit } from "@/src/model/RateLimit.model"
import dbConnect from "@/src/lib/mongoodb"

export async function rateLimit(email: string, username: string) {
  await dbConnect()

  const existing = await RateLimit.findOne({ email, username })

  if (existing) {
    return { allowed: false }
  }

  await RateLimit.create({
    email,
    username
  })

  return { allowed: true }
}