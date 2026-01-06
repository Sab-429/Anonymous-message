import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/order";
import dbconnect from "@/src/lib/mongoodb";
import UserModel from "@/src/model/user.model";
import { User } from "next-auth";

export async function DELETE(request : Request,{params} : {params : {messageid:string}}){
    const messageid = params.messageid
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
    try {
        const updateResult = await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageid}}}
        )
        if(updateResult.modifiedCount == 0){
            return Response.json(
            {
                success: false,
                message:"Message not found or already deleted"
            },{status:404}
        )
        }
        return Response.json(
            {
                success: true,
                message: "Messages deleted successfully"
            },{status:200}
        )
    } catch (error) {
        console.log("Error in deleting message",error)
        return Response.json(
            {
                success: false,
                message: "Error deleting message"
            },{status:500}
        )
    }
}