import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/order";
import dbconnect from "@/src/lib/mongoodb";
import UserModel from "@/src/model/user.model";
import { User } from "next-auth";
import { success } from "zod";

export async function POST(request:Request){
    await dbconnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"NOT Authenticated"
        },{status:401})
    }
    const userId = user._id;
    const {acceptMessage} = await request.json()

    try {
        const updateuser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages:acceptMessage},
            {new: true}
    )
    if(!updateuser){
        return Response.json(
            {
                success:false,
                message:"failed to update user status to accept messages"
            },{status:401}
        )
    }
    else{
        return Response.json(
            {
                success:true,
                message:"Message acceptance staus updated successfully",
                updateuser
            },{status:200}
        )
    }
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success:false,
                message:"failed to update user status to accept messages"
            },{status:500}
        )
    }
}

export async function GET(request:Request){
     await dbconnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"NOT Authenticated"
        },{status:401})
    }
    const userId = user._id;
    try {
    const founduser = await UserModel.findById(userId)
    if(!founduser){
        return Response.json(
            {
                success:false,
                message:"user not found"
            },{status:404}
        )
    }
    
    return Response.json(
        {
            success:true,
            isAcceptingMessages:founduser.isAcceptingMessages
        },{status :200}
    )
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success:false,
                message:"failed to update user status to accept messages"
            },{status:500}
        )
    }
}