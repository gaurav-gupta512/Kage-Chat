'use client'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { verificationSchema } from '@/schema/verificationSchema'
import { useForm } from 'react-hook-form' 
import axios from 'axios'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'

const Page = () => {
    const router = useRouter()
    const params = useParams<{username:string}>()
    const form = useForm<z.infer<typeof verificationSchema>>({
    resolver:zodResolver(verificationSchema),
    defaultValues: {
        verificationCode: ''
      }
    })

    const onSubmit = async (data:z.infer<typeof verificationSchema>)=>{
        try {
            const response = await axios.post('/api/codeVerification',{
                username : params.username,
                verificationCode : data.verificationCode
            })
            toast('Verified!')
            router.replace('/sign-in')
        } catch (error) {
            console.error(`Couldn't verify , please register again`,error)
            toast(`Couldn't verify , please register again`)
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="verificationCode"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>

                <Input placeholder='Verification code' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Verify</Button>
        </form>
      </Form>
    </div>
  </div>
  )
}

export default Page