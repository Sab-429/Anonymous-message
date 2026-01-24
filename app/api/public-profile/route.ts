import dbconnect from '@/src/lib/mongoodb'
import UserModel from '@/src/model/user.model'

export async function GET(req: Request) {
  await dbconnect()

  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username')

    if (!username) {
      return Response.json(
        { success: false, message: 'Username required' },
        { status: 400 }
      )
    }

    const user = await UserModel.findOne({ username }).select(
      'username isAcceptingMessages'
    )

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      isAcceptingMessages: user.isAcceptingMessages,
    })
  } catch (error) {
    console.error('Public profile error:', error)
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
