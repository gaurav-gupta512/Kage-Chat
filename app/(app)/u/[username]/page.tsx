'use client'
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { apiResponse } from "@/types/apiResponse"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form,FormItem,FormControl,FormField, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
// import { useSession } from "next-auth/react"

const Page = () => {
    // const {data:session , status} = useSession()
  const username = useParams().username
  const [messageBox, setMessageBox] = useState('')
  const [isSubmittingForm,setIsSubmittingForm] = useState(false)

  const form = useForm({
    defaultValues: {
        content: ''
    }
  })

  const onMessageSubmit = async(content:any)=>{
    setIsSubmittingForm(true)
    // const user = session?.user
    // const username = user?.username || 'Anonymous User'
    const contentString = content.content
    const data = {username,content:JSON.stringify(contentString)}
    console.log(data)
    try {
        const response = await axios.post<apiResponse>('/api/sendMessage',data)
        console.log(response)
        toast('Message Sent')
    } catch (error) {
        // const axiosError = error as AxiosError<apiResponse>
        // console.error(axiosError)
        toast(`User isn't accepting messages`)
    } finally {
        setIsSubmittingForm(false)
    }
  }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-300">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-6">Sending Messages to {username}</h1>
            <p className="mb-4">Connect with others anonymously through shadowed words.</p>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onMessageSubmit)} className="space-y-6">
              <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Message" 
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
                  'Send Message'
                )}
              </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
  )
}

export default Page