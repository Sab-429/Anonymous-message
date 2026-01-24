import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/order"
import dbconnect from "@/src/lib/mongoodb"
import UserModel from "@/src/model/user.model"
import { User } from "next-auth"
import mongoose from "mongoose"

export async function DELETE(
  request: Request,
  context: { params: Promise<{ messageid: string }> }
) {
  await dbconnect()

  const session = await getServerSession(authOptions)
  const user = session?.user as User

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    )
  }

  // 🔥 THIS IS THE FIX
  const { messageid } = await context.params

  try {
    const messageObjectId = new mongoose.Types.ObjectId(messageid)

    const result = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageObjectId } } }
    )

    if (result.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      )
    }

    return Response.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete error:", error)
    return Response.json(
      { success: false, message: "Error deleting message" },
      { status: 500 }
    )
  }
}
