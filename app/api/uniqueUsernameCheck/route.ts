import dbConnect from "@/lib/dbConnect";
import {z} from "zod"
import userModel from "@/model/User";
import { usernameValidation } from "@/schema/signUpSchema";

const usernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){
    await dbConnect()
    try {
        //ectracting url from user's request
        const {searchParams} = new URL(request.url)
        //extracting only the required query parameter
        const queryParam = {
            username : searchParams.get('username')
        } 
        //validating with zod schema
        const result = usernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            //if invalid , we store it in a variable ( the function below returns arrays of errors )
            const errors = result.error.format().username?._errors || []
            return Response.json({
                success : false,
                message : `Invalid Username`
            },{status : 400})
        }
        const {username} = result.data
        const uniqueUsernameCheck = await userModel.findOne({username,isVerified : true})
        if(uniqueUsernameCheck){
            return Response.json({
                success : false,
                message : `Username already taken`
            },{status : 400})
        }
        return Response.json({
            success : true,
            message : `Username available`
        },{status : 200})
    } catch (error) {
        console.error(`Couldn't check username`,error)
        return Response.json({
            success : false,
            message : `Couldn't check username`
        },{status : 500})
    }
}