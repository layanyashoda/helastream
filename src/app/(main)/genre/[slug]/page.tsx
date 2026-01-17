import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { Movie } from "@/types";
import { MovieCard } from "@/components/movie-card";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

async function getGenreName(slug: string): Promise<string | null> {
    try {
        // 1. Try to find by ID first (if slug is ID)
        const genreDoc = await getDoc(doc(db, "genres", slug));
        if (genreDoc.exists()) {
            return genreDoc.data().name;
        }

        // 2. Fallback: Search by name (normalized)
        // Since we don't have a slug field guaranteed, we fetch all and match
        // This is okay for a small number of genres
        const genresRef = collection(db, "genres");
        const snapshot = await getDocs(genresRef);

        const match = snapshot.docs.find(doc =>
            doc.data().name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase() ||
            doc.data().name.toLowerCase() === slug.toLowerCase()
        );

        return match ? match.data().name : null;
    } catch (error) {
        console.error("Error fetching genre:", error);
        return null;
    }
}

async function getMoviesByGenre(genreName: string): Promise<Movie[]> {
    try {
        const moviesRef = collection(db, "videos");
        // Note: This matches the exact string stored in the 'genre' field of the video
        const q = query(moviesRef, where("genre", "==", genreName));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Movie));
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        return [];
    }
}

export default async function GenrePage({ params }: PageProps) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    // Find the proper genre name
    const genreName = await getGenreName(decodedSlug);

    if (!genreName) {
        notFound();
    }

    const movies = await getMoviesByGenre(genreName);

    return (
        <div className="container-cmp pt-28 pb-20 space-y-8 min-h-screen">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{genreName} Movies</h1>
                    <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
                        {movies.length} {movies.length === 1 ? 'Title' : 'Titles'}
                    </Badge>
                </div>
                <p className="text-muted-foreground">
                    Browse our collection of {genreName} movies and shows.
                </p>
            </div>

            {movies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            image={movie.posterUrl || "/placeholder.jpg"}
                            title={movie.title}
                            year={movie.year?.toString() || "2024"}
                            genre={movie.genre || "Movie"}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center border rounded-lg border-[#23252b] bg-[#141519]">
                    <h2 className="text-xl font-semibold">No movies found</h2>
                    <p className="text-muted-foreground">We couldn't find any content in this genre yet.</p>
                </div>
            )}
        </div>
    );
}
