'use client'
import { useParams,useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { verifySchema } from '@/src/schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { ApiResponse } from '@/src/types/ApiResponse'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const VerifyAccount = () => {
const router = useRouter()
const param = useParams<{ username: string }>()
const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
})

const onSubmit = async(data: z.infer<typeof verifySchema>) => {
    try {
        const response = await axios.post(`/api/verify-code`,{
            username : param.username,
            code:data.code
        })
        toast.success(response.data.message)
        setTimeout(() => {
        router.replace("/sign-in");
        }, 1200);
    } catch (error) {
            const axioserror = error as AxiosError<ApiResponse>
            toast.error(
              axioserror.response?.data?.message || 'Signup failed'
            )
          }
    }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                   Verify Your Account
                </h1>
                <p className="mb-4">Enter the veifiaction Code sent to your email</p>
            </div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your code" 
                          {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Verify
                  </Button>
                </form>
              </Form>
        </div>
    </div>
  )
}
export default VerifyAccount
