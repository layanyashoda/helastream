import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await deleteDoc(doc(db, "genres", id));

        return NextResponse.json({ message: "Genre deleted" });
    } catch (error) {
        console.error("Error deleting genre:", error);
        return NextResponse.json({ error: "Failed to delete genre" }, { status: 500 });
    }
}
