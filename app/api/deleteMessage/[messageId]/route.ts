// import { User } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/options";
// import dbConnect from "@/lib/dbConnect";
// import userModel from "@/model/User";
// import { getServerSession } from "next-auth";

// export async function DELETE(request:Request,{params}:{params:{messageId:string}}){
//     const messageId = await params.messageId
//     await dbConnect()
//     const session = await getServerSession(authOptions)
//     const user:User = session?.user as User

//     if(!session || !session.user){
//         return Response.json({
//             success : false,
//             message : `Invalid Session`
//         },{status : 401})
//     }

//     try {
//         const deleteMsg = await userModel.updateOne(
//             {_id:user._id},
//             {$pull: {messages : {_id: messageId}}}
//         ) 
//         if(deleteMsg.modifiedCount == 0){
//             return Response.json({
//                 success : false,
//                 message : `Message not found/already deleted`
//             },{status : 404})
//         }
//         return Response.json({
//             success : true,
//             message : `Message deleted`
//         },{status : 200})
//     } catch (error) {
//         console.error(`Couldn't delete message`,error)
//         return Response.json({
//             success : false,
//             message : `Couldn't delete message`
//         },{status : 500})
//     }
    
// }

import { NextRequest, NextResponse } from "next/server";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession } from "next-auth";

export async function DELETE(req, context) {
  const messageId = context.params.messageId;

  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: `Invalid Session`,
      },
      { status: 401 }
    );
  }

  try {
    const deleteMsg = await userModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (deleteMsg.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Message not found/already deleted`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Message deleted`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Couldn't delete message`, error);
    return NextResponse.json(
      {
        success: false,
        message: `Couldn't delete message`,
      },
      { status: 500 }
    );
  }
}
