import dbconnect from "@/src/lib/mongoodb";
import UserModel from "@/src/model/user.model";
import {z} from "zod";
import { usernamevalidation } from "../schemas/signupSchema";

const usernamequerySchema = z.object({
    username : usernamevalidation
})
export async function GET(request : Request){
    await dbconnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username : searchParams.get('username')
        };
        const result = usernamequerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors?.length>0 ? usernameErrors.join(',')
                :'Invalid Query Parameters',
            },{status:400})
        }
        const {username} = result.data

        const existingVerifieduser = await UserModel.findOne({
            username,
            isverified:true
        }
    )
    if(existingVerifieduser){
        return Response.json({
            success:false,
            message:"username is already taken"
        },{status:400})
    }else{
        return Response.json({
            success:true,
            message: "username is Unique"
        },{status:200})
    }
    } catch (error) {
        console.error("Error checking username",error)
        return Response.json(
            {
                success:false,
                message : "Error Checking Username"
            },{
                status : 500
            }
        )
    }
}