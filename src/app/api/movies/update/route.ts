import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
        }

        const ref = doc(db, "videos", id);
        await updateDoc(ref, body);

        return NextResponse.json({ message: "Movie updated" });
    } catch (error) {
        console.error("Error updating movie:", error);
        return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
    }
}
