import { message } from "@/model/User";
import { boolean } from "zod";

export interface apiResponse{
    success : boolean
    message : string //response
    isAcceptingMessages? : boolean //optional because api doesnt always needs to be used for this field
    messages? : Array<message> 
}