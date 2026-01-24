import  {NextAuthOptions} from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import dbconnect from "@/src/lib/mongoodb";
import UserModel from "@/src/model/user.model";

export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: "credentials",
            name: "Credintials",
            credentials:{
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials : any) : Promise<any>{
                await dbconnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('NO User found with this email')
                    }
                    if(!user.isverified) {
                        throw new Error('please verify your account before login')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error('Incorrect Password')
                    }
                } catch (err:any) {
                    throw new Error(err)
                }

            }
        })
    ],
    callbacks:{
        async session({ session,token }) {
            if(token){
                session.user._id = token._id
                session.user.isverified = token.isverified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
        },
        async jwt({ token,user }) {
            if(user){
                token._id = user._id?.toString()
                token.isverified = user.isverified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session:{
        strategy: "jwt"
    },
    secret:process.env.NEXTAUTH_SECRET_KEY, 
}
