"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schema/signInSchema"
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
import Link from "next/link"
import { Loader2 } from 'lucide-react'
import { signIn } from "next-auth/react"

export default function Component() {
  const [isSubmittingForm,setIsSubmittingForm] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier : '',
      password : ''
    }
  })
  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmittingForm(true)
  
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })
  
    console.log(result)
  
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast('Incorrect Credentials')
      } else {
        toast('Sign in failed, please try again')
        console.error(result.error)
      }
    } else if (result?.url) {
      router.replace('/dashboard')
    }
  
    setIsSubmittingForm(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join 影チャット</h1>
          <p className="mb-4">Connect with others anonymously through shadowed words.</p>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input placeholder="Username or Email" 
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
          )}
        />
            <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" 
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <Button type="submit" className='w-full my-5' disabled={isSubmittingForm}>
              {isSubmittingForm ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            </form>
          </Form>
          <div>
            <p>New Here ?{' '}
              <Link href={'/sign-up'} className="text-blue-500 hover:text-blue-800">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
  }
