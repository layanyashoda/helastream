import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { GenreList } from "./_components/genre-list";

export const dynamic = 'force-dynamic';

export default async function GenresPage() {
    let genres: { id: string, name: string }[] = [];
    try {
        const genresRef = collection(db, "genres");
        const q = query(genresRef, orderBy("name"));
        const snapshot = await getDocs(q);
        genres = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
    } catch (e) {
        console.error("Failed to load genres", e);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Genre Management</h1>
                <p className="text-muted-foreground">Manage the genres available for movies.</p>
            </div>

            <GenreList initialGenres={genres} />
        </div>
    )
}
