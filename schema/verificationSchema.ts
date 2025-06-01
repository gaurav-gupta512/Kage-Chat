import {z} from 'zod'

export const verificationSchema = z.object({
    verificationCode: z.string().length(6, 'Verification code must be 6 digits'),
  });