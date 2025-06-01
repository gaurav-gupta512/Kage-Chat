'use client'

import { Separator } from "@/components/ui/seperator"
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { message } from "@/model/User"
import { acceptMessageSchema } from "@/schema/acceptMessageSchema"
import { apiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const Page = () => {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<message[]>([])
  const [isSwitchPressed, setIsSwitchPressed] = useState(false)
  const [isMessageLoading, setIsMessageLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })
  const { register, watch, setValue } = form
  const acceptingMessages = watch("acceptingMessages")

  const fetchMessagePreference = useCallback(async () => {
    setIsSwitchPressed(true)
    try {
      const response = await axios.get<apiResponse>("/api/acceptingMessages")
      setValue("acceptingMessages", response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast(`Couldn't update preference: ${axiosError.message}`)
    } finally {
      setIsSwitchPressed(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsMessageLoading(true)
    setIsSwitchPressed(false)
    try {
      const response = await axios.get<apiResponse>("/api/getMessages")
      setMessages(response.data.messages || [])
      if (refresh) toast("Showing latest messages")
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast(`Couldn't load messages: ${axiosError.message}`)
    } finally {
      setIsMessageLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.user) {
      fetchMessages()
      fetchMessagePreference()
    }
  }, [session, fetchMessages, fetchMessagePreference])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<apiResponse>("/api/acceptingMessages", {
        acceptingMessages: !acceptingMessages,
      })
      setValue("acceptingMessages", !acceptingMessages)
      toast(`${response.data.message}`)
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast(`Couldn't change preference: ${axiosError.message}`)
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg._id !== messageId))
  }

  // Safety check
  if (status === "loading") {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>
  }

  if (!session || !session.user) {
    return <div className="h-screen w-screen flex items-center justify-center">Please log in</div>
  }

  const user = session.user as User
  const username = user.username || "unknown"
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : ""
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast("Link copied to clipboard!")
  }

  return (
<div className="my-8 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 bg-white p-6 rounded">

  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">User Dashboard</h1>

  <div className="mb-6">
    <h2 className="text-base sm:text-lg font-semibold mb-3">Copy Your Unique Link</h2>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <input
        type="text"
        value={profileUrl}
        disabled
        className="input input-bordered w-full p-2"
      />
      <Button onClick={copyToClipboard} className="w-full sm:w-auto">Copy</Button>
    </div>
  </div>

  <div className="mb-6 flex items-center">
    <Switch
      {...register('acceptingMessages')}
      checked={acceptingMessages}
      onCheckedChange={handleSwitchChange}
      disabled={isSwitchPressed}
    />
    <span className="ml-3 text-sm sm:text-base">
      Accept Messages: <strong>{acceptingMessages ? 'On' : 'Off'}</strong>
    </span>
  </div>

  <Separator className="mb-6" />

  <Button
    className="mb-6"
    variant="outline"
    onClick={(e) => {
      e.preventDefault();
      fetchMessages(true);
    }}
  >
    {isMessageLoading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <RefreshCcw className="h-4 w-4" />
    )}
  </Button>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {messages.length > 0 ? (
      messages.map((message) => (
        <MessageCard
          key={message._id}
          message={message}
          onMessageDelete={handleDeleteMessage}
        />
      ))
    ) : (
      <p className="col-span-full text-center text-gray-500">No messages to display.</p>
    )}
  </div>
</div>

  )
}

export default Page
