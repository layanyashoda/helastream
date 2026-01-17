import dynamic from "next/dynamic";
import HeaderSkeleton from "@/components/header/index.skeleton";
import Footer from "@/components/footer";
import { auth } from "@/auth";
import { ScrollBlur } from "@/components/ui/scroll-blur";

const Header = dynamic(() => import("@/components/header"), {
    loading: () => <HeaderSkeleton />,
});

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <div className="app-layout relative min-h-screen">
            <Header user={session?.user} />
            <main>
                {children}
            </main>
            <Footer />
            <ScrollBlur />
        </div>
    );
}
