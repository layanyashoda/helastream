import { db } from "@/lib/firebase";
import { collection, query, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);

        const users: User[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                email: data.email,
                role: data.role,
                status: data.status || "active", // Default to active if missing
                createdAt: data.createdAt
            };
        });

        return NextResponse.json(users);
    } catch (e) {
        console.error("Error fetching users:", e);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
        }

        const userRef = doc(db, "users", id);

        // Verify user exists first (optional but good practice)
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        await updateDoc(userRef, { status });

        return NextResponse.json({ message: "User status updated", id, status });
    } catch (e) {
        console.error("Error updating user:", e);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
