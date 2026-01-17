import { db } from "@/lib/firebase";
import { doc, writeBatch } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { updates } = body; // Array of { id, featuredOrder }

        if (!updates || !Array.isArray(updates)) {
            return NextResponse.json({ error: "Invalid updates payload" }, { status: 400 });
        }

        const batch = writeBatch(db);

        updates.forEach((update: { id: string, featuredOrder: number }) => {
            const ref = doc(db, "videos", update.id);
            batch.update(ref, { featuredOrder: update.featuredOrder });
        });

        await batch.commit();

        return NextResponse.json({ message: "Order updated" });
    } catch (error) {
        console.error("Error reordering movies:", error);
        return NextResponse.json({ error: "Failed to reorder movies" }, { status: 500 });
    }
}
