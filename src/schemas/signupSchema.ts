import {z} from 'zod'

export const usernamevalidation = z
    .string()
    .min(2,"Username must be atleast 2 charcters")
    .max(20,"Username must not be more than 20 chracters")
    .regex(/^[a-zA-Z-9_]+$/,"Username must not contain special charcters")

export const signupSchema = z.object({
    username: usernamevalidation,
    email:z.string().email({message:'Invalid email address'}),
    password: z.string().min(6,{message:"password should be atlest 6 chracters"})
})