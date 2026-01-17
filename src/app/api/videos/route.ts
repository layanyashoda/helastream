import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, addDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { VideoMetadata } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const videosRef = collection(db, "videos");
        const q = query(videosRef, orderBy("uploadDate", "desc"));
        const snapshot = await getDocs(q);

        const videos: VideoMetadata[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as any)
        }));

        return NextResponse.json(videos);
    } catch (e) {
        console.error("Error fetching videos:", e);
        // Return mock if DB fails or empty
        return NextResponse.json([]);
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // Body should contain { filename, streamingUrl, status, size, etc. }
        // We add uploadDate server-side

        const newVideo = {
            ...body,
            uploadDate: new Date().toISOString(),
            status: body.status || "Processing"
        };

        const res = await addDoc(collection(db, "videos"), newVideo);

        return NextResponse.json({ id: res.id, ...newVideo }, { status: 201 });
    } catch (e) {
        console.error("Error creating video:", e);
        return NextResponse.json({ error: "Failed to save metadata" }, { status: 500 });
    }
}
