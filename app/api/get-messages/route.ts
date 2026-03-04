import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/order"
import UserModel from "@/src/model/user.model"
import dbconnect from "@/src/lib/mongoodb"
import { success } from "zod"

export async function GET() {
  await dbconnect()

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ success: false }, { status: 401 })
  }

  const user = await UserModel.findOne(
    { email: session.user.email },
    { messages: 1 , isAcceptingMessages: 1}
  )

  if (!user) {
    return Response.json({ success: false }, { status: 404 })
  }
  if(!user.isAcceptingMessages) {
    return Response.json({
      success: true,
      messages : []
    })
  }
  return Response.json({
    success: true,
    messages: [...user.messages].reverse()
  })
}
