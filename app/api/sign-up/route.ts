import dbconnect from "@/src/lib/mongoodb";
import UserModel from "@/src/model/user.model";
import bcrypt from "bcrypt"
import { sendverificationemail} from "@/src/helpers/sendverificationemail";

export async function POST(request : Request){
    await dbconnect()

    try {
        const {username,email,password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isverified:true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"username already taken"
            },{status:400})
        }

        const existinguseremail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        if(existinguseremail){
            if(existinguseremail.isverified){
                return Response.json({
                success:false,
                message: "User already exists with this email"
            },{status: 400})
            }else{
              const hashedpassword = await bcrypt.hash(password,10)
              existinguseremail.password = hashedpassword;
              existinguseremail.verifyCode = verifyCode;
              existinguseremail.verifyCodeExpiry = new Date(Date.now()+360000)
              await existinguseremail.save()

              const emailResponse = await sendverificationemail(
                email,
                username,
                verifyCode
              )
          
              if(!emailResponse.success){
                return Response.json({
                  success:false,
                  message: emailResponse.message
                },{status:500})
              }
          
              return Response.json({
                success:true,
                message:"Verification code resent successfully"
              },{status:200})
            }

        }else{
            const hashedpassword  = await bcrypt.hash(password,10) 
            const expirydate = new Date()
            expirydate.setHours(expirydate.getHours()+1)

            const newUser = new UserModel({
                    username,
                    email,
                    password: hashedpassword,
                    verifyCode,
                    verifyCodeExpiry:expirydate,
                    isverified:false,
                    isAcceptingMessages:true,
                    messages:[]
            })
            await newUser.save()

            //send verification email
            const emailResponse = await sendverificationemail(
                email,
                username,
                verifyCode
            )
            if(!emailResponse.success){
                return Response.json({
                    success:false,
                    message: emailResponse.message
                },{status: 500})
            }
            return Response.json({
                success:true,
                message:"User registered successfully"
            },{status : 201})
        }
    } catch (error) {
        console.error('Error registration user',error)
        return Response.json(
            {
                success :false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}