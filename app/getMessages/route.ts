import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

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

    //aggregation pipelines do nut understand strings ( we converted the id to string in options.ts)
    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        //beginning aggregation
        //getting only the user required through id
        const user = await userModel.aggregate([
            {$match : {_id: userId}}, //matching user thru id
            {$unwind : '$messages'} // unwind , used especially for arrays , seperates each one into objects. 'messages' is coming from the schema attribute 'message' .refer to //user blueprint in model/User.ts
            ,{$sort : {'messages.createdAt':-1}} // sorts messages in '-1' ascending order
            ,{$group : {_id : '$_id',messages : {$push : '$messages'}}} //groups messages , now all messages are pushed to only the user by their id, objects dont need to contain id now. only one object remains now , that contains all the messages
        ])
        
        if(!user || user.length === 0){
            return Response.json({
                success : false,
                message : `User not found`
            },{status : 401})
        }
        return Response.json({
            success : true,
            message : `Aggregated`,
            messages : user[0].messages //user's first object returns the messages
        },{status : 200})
        } catch (error) {
            console.error('Aggregation failed',error)
            return Response.json({
                success : false,
                message : `Aggregation failed`
            },{status : 500})
    }
}