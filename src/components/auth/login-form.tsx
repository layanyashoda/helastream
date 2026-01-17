
"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            setError("Invalid email or password")
            setIsLoading(false)
        } else {
            router.push("/")
            router.refresh()
        }
    }

    return (
        <div className={cn("grid gap-6 w-[450px]", className)} {...props}>
            <div className="flex flex-col gap-6 p-8 bg-[#191a21] border border-[#23252b] rounded-xl shadow-lg">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-2xl font-bold text-white">Login</h1>
                    <p className="text-sm text-gray-400">
                        Enter your email below to login
                    </p>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className="bg-[#23252b] border-[#34363e] text-white placeholder:text-gray-500 focus:ring-[#FF0000] focus:border-[#FF0000]"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-[#23252b] border-[#34363e] text-white focus:ring-[#FF0000] focus:border-[#FF0000]"
                            />
                            <div className="flex items-center">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            type="button"
                                            className="ml-auto text-sm underline-offset-4 hover:underline text-gray-400 hover:text-white"
                                        >
                                            Forgot your password?
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Reset Password</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                If you have forgotten your password, please contact support or check your email for reset instructions.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>OK</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <Button type="submit" className="w-full bg-[#FF0000] hover:bg-[#D40000] text-white font-bold" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Login
                        </Button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-400">
                    <div className="mb-2">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="underline underline-offset-4 hover:text-white">
                            Sign up
                        </Link>
                    </div>
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                        By clicking login, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}
