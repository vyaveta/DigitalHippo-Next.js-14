import { AuthCredentialsSchema } from "../lib/validators/account-credentials";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const authRouter = router({
    createPayloadUser: publicProcedure.input(AuthCredentialsSchema).mutation(async ({input}) => {
        const { email, password } = input
        const payload = await getPayloadClient()

        //check  if user already exits
        const {docs: users} = await payload.find({
            collection: "users", 
            where: {
                email: {
                    equals: email
                }
            }
        })

        if(users.length !==0) throw new TRPCError({ code: "CONFLICT" }) 

        await payload.create({
            collection: "users",
            data: {
                email,
                password,
                role: 'user'
            },
        })
        return { success: true, sentToEmail: email }
    }),

    verifyEmail: publicProcedure.input(z.object({ token: z.string() })).query( async ({ input }) => {
        const { token } = input
        const payload = await getPayloadClient()

        const isVerified = await payload.verifyEmail({
            collection: "users",
            token,            
        })

        if(!isVerified) throw new TRPCError({ code: "UNAUTHORIZED"})

        return { success: true}
    }),

    signIn: publicProcedure.input(AuthCredentialsSchema).mutation( async ({input, ctx}) => {
            
            let errorFlag: boolean = false
            const { email, password } = input
            const payload = await getPayloadClient()
            const { res } = ctx

           try{
            console.log("got here2")
            await payload.login({
                collection: "users",
                data:{
                    email,
                    password,
                },
                res,
            })
            // console.log('response is', response)
           }catch(_){
            console.log("error happened")
            errorFlag=true;
            throw new TRPCError({code: "UNAUTHORIZED"})
           }
            
                return { success: true, message: "logged in succesfully" }
        }
    )
})