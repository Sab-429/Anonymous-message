import NextAuth from "next-auth/next"
import { authOptions } from "./order"

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}