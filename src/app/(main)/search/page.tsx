import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Movie } from "@/types";
import { SearchInterface } from "./_components/search-interface";

export const dynamic = 'force-dynamic';

export default async function SearchPage() {
    // Fetch Movies
    let movies: Movie[] = [];
    try {
        const moviesRef = collection(db, "videos");
        const q = query(moviesRef, orderBy("title"));
        const snapshot = await getDocs(q);
        movies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
    } catch (e) {
        console.error("Failed to fetch movies", e);
    }

    // Fetch Genres
    let genres: { id: string, name: string }[] = [];
    try {
        const genresRef = collection(db, "genres");
        const q = query(genresRef, orderBy("name"));
        const snapshot = await getDocs(q);
        genres = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
    } catch (e) {
        console.error("Failed to fetch genres", e);
    }

    return (
        <div className="container-cmp pt-8 pb-20 space-y-8">
            <h1 className="text-3xl font-bold text-center">Find Your Next Adventure</h1>
            <SearchInterface movies={movies} genres={genres} />
        </div>
    )
}
