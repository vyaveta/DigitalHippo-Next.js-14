import { z } from "zod"

export const AuthCredentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "password must be atleast 6 characters long"})
})

export type TAuthCredentialsSchema = z.infer<typeof AuthCredentialsSchema>