import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { HeaderLogoLarge } from "@/assets/headerLogo"

export default function RegisterPage() {
    return (
        <div className="w-full h-screen overflow-hidden lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] relative">
            <div className="absolute top-8 left-8 z-30">
                <Link href="/">
                    <HeaderLogoLarge />
                </Link>
            </div>
            <div className="hidden bg-muted lg:block relative order-last lg:order-first">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop"
                    alt="Image"
                    className="h-full w-full object-cover dark:brightness-[0.5] grayscale"
                />
                <div className="absolute bottom-10 left-10 z-20">
                    <h2 className="text-4xl font-bold text-white mb-2">Join the Revolution.</h2>
                    <p className="text-gray-300 text-lg">Unlimited movies, TV shows, and more.</p>
                </div>
            </div>
            <div className="flex items-center justify-center py-12">
                <RegisterForm />
            </div>
        </div>
    )
}
