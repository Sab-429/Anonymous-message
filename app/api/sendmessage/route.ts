import UserModel from "@/src/model/user.model";
import dbconnect from "@/src/lib/mongoodb"
import { Messsage } from "@/src/model/user.model";
import { success } from "zod";

export async function POST(request : Request){
    await dbconnect()

    const {username,content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },{status : 404}
            )
        }
        if(!user.isAcceptingMessages){
            return Response.json(
                {
                    success: false,
                    message:"User is not Accepting the messages"
                },{status:403}
            )
        }
        const  newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage  as Messsage)
        await user.save()
        return Response.json(
                {
                    success:true,
                    messages:user.messages
                },{status:200}
        )
    } catch (error) {
        console.log("An unexpected error occured:",error)
        return Response.json(
                {
                    success:false,
                    messages:"Internal Server Error"
                },{status:500}
        )
    }
}