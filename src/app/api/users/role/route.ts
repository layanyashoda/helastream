import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        // Basic authorization check - mostly reliant on middleware/client, 
        // but good to have a check here if we had a robust way to verify admin status from session without extra DB call.
        // For now, assuming if they hit this, they are authorized or we rely on client discretion (MVP).
        // ADDED SECURITY: Check if requester is admin.
        if (session?.user?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { userId, newRole } = body;

        if (!userId || !newRole) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!['admin', 'user'].includes(newRole)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role: newRole });

        return NextResponse.json({ message: "User role updated" });
    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
    }
}
