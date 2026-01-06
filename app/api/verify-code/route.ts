import dbconnect from "@/src/lib/mongoodb";
import UserModel from "@/src/model/user.model";
import { success } from "zod";

export async function POST(request:Request){
    await dbconnect()

    try {
        const {username,code} = await request.json()
        const decodeusername = decodeURIComponent(username)
        const user = await UserModel.findOne(
            {
                username:decodeusername
            }
        )
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },{status:500}
            )
        }
       const iscodevalid = user.verifyCode === code
       const iscodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

       if(iscodevalid && iscodeNotExpired){
        user.isverified = true
        await user.save()
           return Response.json(
                {
                    success:true,
                    message:"Account verified successfully"
                },{status:200}
            )
       }else if(!iscodeNotExpired){
        return Response.json(
            {
                success:false,
                message:"verification code has expired"
            },{status:400}
        )
       }else{
             return Response.json(
                {
                    success:false,
                    message:"Invalid verification code"
                },{status:500}
            )
       }
    } catch (error) {
        console.error("Error verifying user",error)
        return Response.json(
            {
                success:false,
                message:"Error Verifying user"
            },{status:500}
        )
    }
}