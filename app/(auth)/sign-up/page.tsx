"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState,useEffect } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schema/signUpSchema"
import axios,{AxiosError} from 'axios'
import { apiResponse } from "@/types/apiResponse"
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

export default function Component() {
  const [username, setUsername] = useState('')
  const [isUsernameAvailable, setIsUsernameAvailable] = useState('')
  const [isCheckingUsernameAvailability,setIsCheckingUsernameAvailability] = useState(false)
  const [isSubmittingForm,setIsSubmittingForm] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username : '',
      email : '',
      password : ''
    }
  })

  useEffect(() => {
    const uniqueUsername = async ()=> {
      if(username){
        setIsCheckingUsernameAvailability(true)
        setIsUsernameAvailable('')
        try {
          const response = await axios.get(`/api/uniqueUsernameCheck?username=${username}`)
          setIsUsernameAvailable(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>
          setIsUsernameAvailable(axiosError.response?.data.message ?? `Couldn't check username availability`)     
        } finally{
          setIsCheckingUsernameAvailability(false)
        }
      }
    }
    uniqueUsername()
  }, [username])
  
  const onSubmit = async (data:z.infer<typeof signUpSchema>)=>{
    setIsSubmittingForm(true)
    try {
      const response = await axios.post<apiResponse>('api/signUp',data)
      console.log(response)
      // toast('Success',{
      //   description : response.data.message,
      //   duration : 5000
      // })
      toast('User Registered')
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.error(`Couldn't register user`,error)
      // toast('Failure',{
      //   description : `Couldn't Register User`,
      //   duration : 5000
      // })
      toast(`Couldn't Register , Please try again`)
    } finally{
      setIsSubmittingForm(false)
    }
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" 
                {...field}
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>
              {isCheckingUsernameAvailability && <Loader2 className="animate-spin" />}
              {!isCheckingUsernameAvailability && isUsernameAvailable && (
                    <p
                      className={`text-sm ${
                        isUsernameAvailable === 'Username available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {isUsernameAvailable}
                    </p>
                  )}
              <FormMessage />
            </FormItem>
            
          )}
        />
            <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" 
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
                'Sign Up'
              )}
            </Button>
            </form>
          </Form>
          <div>
            <p>Already a member ?{' '}
              <Link href={'/sign-in'} className="text-blue-500 hover:text-blue-800">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )

}