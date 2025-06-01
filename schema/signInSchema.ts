import {z} from 'zod'

export const signInSchema = z.object({
    identifier : z.string(), //more common production word for username
    password : z.string()
})