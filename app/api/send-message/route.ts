import dbconnect from "@/src/lib/mongoodb"
import UserModel from "@/src/model/user.model"
import { RateLimit } from "@/src/model/RateLimit.model"


export async function POST(req: Request) {
  await dbconnect()

  const { username, content , email } = await req.json()

  if (!username || !content || !email) {
    return Response.json(
      { success: false, message: "Invalid data" },
      { status: 400 }
    )
  }
  const LIMIT = 3;
  let limiter = await RateLimit.findOne({email})
  if(!limiter) {
    limiter = await RateLimit.create({email,count: 1})
  }else{
    if(limiter.count >= LIMIT){
      return Response.json(
        {
          success: false,
          message: "Limit reached"
        },
        {status: 403}
      )
    }
    limiter.count += 1;
    await limiter.save()
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