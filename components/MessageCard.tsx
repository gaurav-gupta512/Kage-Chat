import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"  
import React from 'react'
import { message } from "@/model/User"
import { toast } from "sonner"
import axios from "axios"
import { apiResponse } from "@/types/apiResponse"

type MessageCardProps = {
    message : message,
    onMessageDelete : (messageId:any)=> void
}

const MessageCard = ({ message,onMessageDelete }:MessageCardProps) => {
    const handleDelete = async ()=>{
        const response = await axios.delete<apiResponse>(`/api/deleteMessage/${message._id}`)
        // toast('')
        onMessageDelete(message._id)
    }
    const messege = message
  return (
    <div>

  <Card>
  <CardHeader>
    {/* <CardTitle>Card Title</CardTitle> */}
    <CardDescription>{messege.content.replace(/^"(.*)"$/, '$1')}</CardDescription>
  </CardHeader>
  <CardContent>
  </CardContent>
  <AlertDialog>
  <AlertDialogTrigger className="text-md font-bold">Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This message will be removed from your account
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
    <AlertDialogCancel onClick={() => {
        toast('u cancelled cro')
      }}>
        Cancel
      </AlertDialogCancel>
      
      <AlertDialogAction onClick={() => {
        handleDelete()
        toast('u confirmed cro')
      }}>Confirm 😱
</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
</Card>

    </div>

  )
}

export default MessageCard

