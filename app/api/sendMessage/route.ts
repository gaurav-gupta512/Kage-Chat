import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect()
    const {username,content} = await request.json()
    try {
        const user = await userModel.findOne({username})
        if(!user){
            return Response.json({
                success : false,
                message : `User not found`,
                },{status : 404})
        }

        //find if target user is accepting messages
        if(!user.isAcceptingMessages){
            return Response.json({
                success : false,
                message : `User isn't accepting messages`,
                },{status : 403})
        }
        const newMessage = {content,createdAt : new Date()}
        user.messages.push(newMessage as message)
        await user.save()
        return Response.json({
            success : true,
            message : `Message sent`,
            },{status : 200})
    } catch (error) {
        console.error(`Couldn't send message`,error)
        return Response.json({
            success : false,
            message : `Couldn't send message`,
            },{status : 500})
    }
}