"use client"

import { Icons } from "@/components/Icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AuthCredentialsSchema, TAuthCredentialsSchema } from "@/lib/validators/account-credentials"
import { trpc } from "@/trpc/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const Page = () => {

    const searchParams = useSearchParams()
    const router = useRouter()

    const isSeller = searchParams.get("as") === 'seller'
    const origin = searchParams.get('origin')

    const continueAsSeller = () => router.push("?as=seller")
    const contunueAsBuyer = () => router.push("?as=buyer")


    const { register, handleSubmit, formState: { errors }, getValues } = useForm<TAuthCredentialsSchema>({
        resolver: zodResolver(AuthCredentialsSchema),
    })

    const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
        onSuccess: (data) => {
            console.log("after login func",data)
            toast.success("signed in succesfully!")
            router.refresh()
            if (origin) return router.push(`/${origin}`)
            if (isSeller) return router.push('/sell')
            router.push('/')
        },
        onError: (err) => {
            if (err.data?.code === "UNAUTHORIZED") toast.error("Invalid credentials")
        }
    })

    const onSubmit = ({ email, password }: TAuthCredentialsSchema) => {
        signIn({ email, password })
    }

    return (
        <>
            <div className="container relative pt-20 flex flex-col items-center justify-center lg:px-0" >
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]" >
                    <div className="flex flex-col items-center space-y-2 text-center" >
                        <Icons.logo className="h-20 w-20" />
                        <h1 className="text-2xl font-bold" >
                            Sign in to your {isSeller ? "Seller" : ""} Account.
                        </h1>
                        <Link className={buttonVariants({ variant: "link", className: "gap-1.5" })} href='/sign-up' >
                            Dont&&apos; have an account? Sign-up
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid gap-6" >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-2" >
                                <div className="grid gap-1 py-2" >
                                    <Label htmlFor="email" >Email</Label>
                                    <Input
                                        {...register("email")}
                                        className={cn({
                                            "focus-visible:ring-red-500": errors.email,
                                        })}
                                        placeholder="you@exmple.com"
                                    />
                                    {errors.email &&
                                        <p className="text-sm text-red-500" >
                                            {errors.email.message}
                                        </p>}
                                </div>

                                <div className="grid gap-1 py-2" >
                                    <Label htmlFor="password" >Password</Label>
                                    <Input
                                        {...register("password")}
                                        type="password"
                                        className={cn({
                                            "focus-visible:ring-red-500": errors.password,
                                        })}
                                        placeholder="password"
                                    />
                                    {errors.password &&
                                        <p className="text-sm text-red-500" >
                                            {errors.password.message}
                                        </p>}
                                </div>
                                <Button>
                                    Sign in
                                </Button>
                            </div>
                        </form>
                        <div className="relative" >
                            <div className="absolute inset-0 flex items-center" aria-hidden="true" >
                                <span className="wi-full border-t" />
                            </div>
                            <div className="flex relative justify-center text-xs uppercase" >
                                <span className="bg-background px-2 text-muted-foreground" >
                                    or
                                </span>
                            </div>
                        </div>

                        {
                            isSeller ? (
                                <Button
                                    onClick={contunueAsBuyer}
                                    variant="secondary"
                                    disabled={isLoading}>
                                    Continue as customer
                                </Button>
                            ) : <Button
                                onClick={continueAsSeller}
                                variant="secondary"
                                disabled={isLoading}>
                                Continue as seller
                            </Button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page