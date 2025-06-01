import {z} from 'zod'

export const messageSchema = z.object({
    content : z.string()
    // .min(5,{message :'Message too short , must be atleast 5 characters'} )
    // .max(500,{message :'Message limit is 500 characters'} )
})