import dbconnect from "@/src/lib/mongoodb"
import UserModel from "@/src/model/user.model"
import { rateLimit } from '@/src/lib/rateLimit'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const headersList = headers()
const ip =
  (await headersList).get('x-forwarded-for')?.split(',')[0] ||
  '127.0.0.1'

const { allowed } = await rateLimit(ip)

if (!allowed) {
  return Response.json(
    {
      success: false,
      message: 'Too many messages sent. Please try later.',
    },
    { status: 429 }
  )
}

  await dbconnect()
  const { username, content } = await req.json()

  if (!username || !content) {
    return Response.json(
      { success: false, message: "Invalid data" },
      { status: 400 }
    )
  }

  const user = await UserModel.findOne({ username })

  if (!user) {
    return Response.json(
      { success: false, message: "User not found" },
      { status: 404 }
    )
  }

  if (!user.isAcceptingMessages) {
    return Response.json(
      { success: false, message: "User is not accepting messages" },
      { status: 403 }
    )
  }

  user.messages.push({
    content,
    createdAt: new Date(),
  } as any)
  await user.save()

  return Response.json(
    { success: true, message: "Message sent successfully" },
    { status: 200 }
  )
}
