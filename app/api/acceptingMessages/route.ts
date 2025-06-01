import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession } from "next-auth";

export async function POST(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session && !session.user){
        return Response.json({
            success : false,
            message : `Invalid Session`
        },{status : 401})
    }

    const userId = user._id
    const {acceptingMessages} = await request.json()
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages : acceptingMessages },
            { new : true }
        )
        if(!updatedUser){
            return Response.json({
                success : false,
                message : `Failed to update User Status`
            },{status : 401})
        }
        return Response.json({
            success : true,
            message : `User Status updated`,
            updatedUser
        },{status : 200})
    } catch (error) {
        console.error(`Failed to update User Status`,error)
        return Response.json({
            success : false,
            message : `Failed to update User Status`
        },{status : 500})
    }
}

export async function GET(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : `Invalid Session`
        },{status : 401})
    }

    const userId = user._id
    try {        
        const foundUser = await userModel.findById(userId)
        if(!foundUser){
            return Response.json({
                success : false,
                message : `Failed to find user`
            },{status : 404})
        }
        return Response.json({
            success : true,
            message : `User Status retrieved`,
            isAcceptingMessages : foundUser.isAcceptingMessages
        },{status : 200})
    } catch (error) {
        console.error(`Failed to get User Status`,error)
        return Response.json({
            success : false,
            message : `Failed to get User Status`
        },{status : 500})
    }

}