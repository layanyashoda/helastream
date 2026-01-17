
"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function RegisterForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                router.push("/login?registered=true");
            } else {
                const data = await res.json();
                setError(data.error || "Registration failed");
            }
        } catch (e) {
            setError("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn("grid gap-6 w-[450px]", className)} {...props}>
            <div className="flex flex-col gap-6 p-8 bg-[#191a21] border border-[#23252b] rounded-xl shadow-lg">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-2xl font-bold text-white">Sign Up</h1>
                    <p className="text-sm text-gray-400">
                        Enter your information to create an account
                    </p>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-gray-300">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                required
                                className="bg-[#23252b] border-[#34363e] text-white focus:ring-[#FF0000] focus:border-[#FF0000]"
                            />
                        </div>
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
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="bg-[#23252b] border-[#34363e] text-white pr-10 focus:ring-[#FF0000] focus:border-[#FF0000]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <Button type="submit" className="w-full bg-[#FF0000] hover:bg-[#D40000] text-white font-bold" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Sign Up
                        </Button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-400">
                    <div className="mb-2">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4 hover:text-white">
                            Login
                        </Link>
                    </div>
                    <div className="text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                        By clicking sign up, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}
