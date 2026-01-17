import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    try {
        const docRef = doc(db, "settings", "global");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return NextResponse.json(docSnap.data());
        } else {
            // Return defaults if not set
            return NextResponse.json({
                maintenanceMode: false,
                announcementEnabled: false,
                announcementMessage: ""
            });
        }
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if ((session?.user as any)?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const docRef = doc(db, "settings", "global");

        // Merge true to keep other settings if we ever add partial updates, 
        // though here we likely send whole object or whatever is changed.
        await setDoc(docRef, body, { merge: true });

        return NextResponse.json({ message: "Settings updated" });
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
