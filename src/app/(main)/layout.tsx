import dynamic from "next/dynamic";
import HeaderSkeleton from "@/components/header/index.skeleton";
import Footer from "@/components/footer";
import { auth } from "@/auth";
import { ScrollBlur } from "@/components/ui/scroll-blur";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import MaintenanceScreen from "@/components/maintenance-screen";
import { AlertTriangle } from "lucide-react";
import { AnnouncementBar } from "@/components/announcement-bar";

const Header = dynamic(() => import("@/components/header"), {
    loading: () => <HeaderSkeleton />,
});

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    // Fetch Settings
    let settings = {
        maintenanceMode: false,
        announcementEnabled: false,
        announcementMessage: ""
    };
    try {
        const docSnap = await getDoc(doc(db, "settings", "global"));
        if (docSnap.exists()) {
            settings = docSnap.data() as any;
        }
    } catch (e) {
        console.error("Failed to load settings in layout", e);
    }

    // Maintenance Mode Check
    // Allow if user is admin or maintenance mode is off
    if (settings.maintenanceMode && (session?.user as any)?.role !== 'admin') {
        return <MaintenanceScreen />;
    }

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Announcement Bar */}
            {settings.announcementEnabled && settings.announcementMessage && (
                <AnnouncementBar message={settings.announcementMessage} />
            )}

            <Header user={session?.user} />
            <main>
                {children}
            </main>
            <Footer />
            <ScrollBlur />
        </div>
    );
}
