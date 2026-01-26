import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { auth } from "@/auth";

// GET - Check if movie is in user's watchlist
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ inWatchlist: false });
        }

        const { searchParams } = new URL(request.url);
        const movieId = searchParams.get("movieId");

        if (!movieId) {
            return NextResponse.json({ error: "movieId required" }, { status: 400 });
        }

        const watchlistRef = doc(db, "users", session.user.id, "watchlist", movieId);
        const docSnap = await getDoc(watchlistRef);

        return NextResponse.json({ inWatchlist: docSnap.exists() });
    } catch (error) {
        console.error("Error checking watchlist:", error);
        return NextResponse.json({ error: "Failed to check watchlist" }, { status: 500 });
    }
}

// POST - Add movie to watchlist
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { movieId, title, posterUrl } = body;

        if (!movieId) {
            return NextResponse.json({ error: "movieId required" }, { status: 400 });
        }

        const watchlistRef = doc(db, "users", session.user.id, "watchlist", movieId);
        await setDoc(watchlistRef, {
            movieId,
            title: title || "",
            posterUrl: posterUrl || "",
            addedAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true, inWatchlist: true });
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
    }
}

// DELETE - Remove movie from watchlist
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const movieId = searchParams.get("movieId");

        if (!movieId) {
            return NextResponse.json({ error: "movieId required" }, { status: 400 });
        }

        const watchlistRef = doc(db, "users", session.user.id, "watchlist", movieId);
        await deleteDoc(watchlistRef);

        return NextResponse.json({ success: true, inWatchlist: false });
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
    }
}
