import mongoose,{Schema,Document} from "mongoose";

//message blueprint
export interface message extends Document{
    content : string
    createdAt : Date
}

//message model
const MessageSchema : Schema<message> = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
})

//user blueprint
export interface user extends Document{
    username : string
    email : string
    password : string
    verificationCode : string
    verificationCodeExpiry : Date
    isVerified : boolean
    isAcceptingMessages : boolean
    messages : message[] // using the message schema 
}

//user model
const userSchema : Schema<user> = new Schema({
    username : {
        type : String,
        required : [true,"Username is required"], // string is for error message
        trim : true, // remove spaces from username
        unique : true
    },
    email : {
        type : String,
        required : [true,"Email is required"],
        unique : true,
        match : [/.+\@.+\..+/,'Please use a valid email address'] // array object 1 - simple regex for email , 2 - error message
    },
    password : {
        type : String,
        required : [true,"Password is required"]
    },
    verificationCode : {
        type : String,
        required : [true,"Verification Code is required"]
    },
    verificationCodeExpiry : {
        type : Date,
        required : [true,"Verification Code Expiry is required"]
    },
    isVerified : {
        type : Boolean,
        required : [true,"Verification is required"]
    },
    isAcceptingMessages : {
        type : Boolean,
        default : true
    },
    messages : [MessageSchema] //using message schema array
})

const userModel = mongoose.models.User || mongoose.model<user>("User",userSchema)

export default userModel