import {z} from 'zod'

export const usernameValidation = z
.string()
.min(2,'Username must be atleast 2 characters long')
.max(20,`Username shouldn't be longer than 20 characters`)
.regex(/^[a-zA-Z0-9_]+$/,`Username mustn't contain special characters except _`)

export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : 'Email must be valid'}),
    password : z.string().min(8,{message : 'Password must be atleast 8 characters long'})
})