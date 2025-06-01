import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export async function POST(request:Request) {
    await dbConnect()
    try {
        const {username,verificationCode} = await request.json()
        console.log(username,verificationCode)
        const decodedUsername = decodeURIComponent(username)
        const user = await userModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success : false,
                message : `User not found`
            },{status : 500})
        }

        const isCodeCorrect = user.verificationCode === verificationCode
        const isCodeValid = new Date(user.verificationCodeExpiry) > new Date()

        if(isCodeCorrect && isCodeValid){
            user.isVerified = true
            await user.save()
            return Response.json({
                success : true,
                message : `User Verified`
            },{status : 200})
        } else if(!isCodeValid){
            return Response.json({
                success : false,
                message : `Verification code expired`
            },{status : 400})
        } else{
            return Response.json({
                success : false,
                message : `Incorrect Code`
            },{status : 400})
        }

    } catch (error) {
        console.error(`Verification Failed`,error)
        return Response.json({
            success : false,
            message : `Verification Failed`
        },{status : 500})
    }
}