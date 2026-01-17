import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, orderBy } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const genresRef = collection(db, "genres");
        const q = query(genresRef, orderBy("name"));
        const snapshot = await getDocs(q);

        const genres = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name
        }));

        return NextResponse.json(genres);
    } catch (error) {
        console.error("Error fetching genres:", error);
        return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

        const genresRef = collection(db, "genres");
        const docRef = await addDoc(genresRef, { name });

        return NextResponse.json({ id: docRef.id, name });
    } catch (error) {
        console.error("Error adding genre:", error);
        return NextResponse.json({ error: "Failed to add genre" }, { status: 500 });
    }
}
