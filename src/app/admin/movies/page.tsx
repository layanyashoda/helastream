import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import Link from "next/link";
import { MoviesTable } from "../_components/movies-table";

export const dynamic = 'force-dynamic';

export default async function MoviesPage() {
    let movies: Movie[] = [];
    try {
        const moviesRef = collection(db, "videos"); // "videos" collection
        const q = query(moviesRef, orderBy("uploadDate", "desc"));
        const snapshot = await getDocs(q);

        movies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as any)
        }));
    } catch (e) {
        console.error("Failed to fetch movies", e);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Movies Library</h1>
                    <p className="text-muted-foreground">Manage your movie catalog and assets.</p>
                </div>
                <Link href="/admin/movies/add">
                    <Button className="bg-[#ff640a] hover:bg-[#e05200] text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Movie
                    </Button>
                </Link>
            </div>

            <MoviesTable movies={movies} />
        </div>
    )
}

