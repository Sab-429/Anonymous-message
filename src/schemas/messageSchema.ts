import {z} from 'zod'

export const signinSchema = z.object({
    content: z
    .string()
    .min(10,{message: 'contents must be atleast 10 characters'})
    .max(300,{message: 'contents must not more than 300 characters'})
})
