import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/order";
import dbconnect from "@/src/lib/mongoodb";
import UserModel from "@/src/model/user.model";
import { User } from "next-auth";
import { success } from "zod";
import mongoose from "mongoose";

export async function GET(request : Request){
    await dbconnect()
    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message:"Not Authenticated"
            },{status:401}
        )
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            {$match : {id : userId}},
            {$unwind : '$message'},
            {$sort: {'message.createdAt' : -1}},
            {$group : {_id : '$_id',messages : {$push:'$messages'}}}
        ])
        if(!user || user.length === 0){
            return Response.json(
                {
                    success:false,
                    message:"user not found"
                },{status:401}
            )
        }

        return Response.json(
            {
               success:true,
               messages : user[0].messages 
            },{status:200}
        )
    } catch (error) {
        console.log("An unexpected error occured:",error)
        return Response.json(
            {
                success:false,
                message: "Not Authenticated"
            },{status:500}
        )
    }
}