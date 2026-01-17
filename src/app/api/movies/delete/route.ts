import { db, storage } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Movie ID is required" }, { status: 400 });
        }

        // Note: To truly clean up, we should also delete the files in Storage.
        // However, we need the file paths/URLs to do that, which means fetching the doc first.
        // For now, we will just delete the metadata document as requested.
        // In a production app, we would fetch -> delete files -> delete doc.

        await deleteDoc(doc(db, "videos", id)); // "videos" collection

        return NextResponse.json({ message: "Movie deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting movie:", error);
        return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
    }
}
