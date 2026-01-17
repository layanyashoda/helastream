"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Movie } from "@/types";
import { MovieCard } from "@/components/movie-card";
import { Loader2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WatchlistButton } from "@/components/watchlist-button";

export default function WatchlistPage() {
    const { data: session, status } = useSession();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            setIsLoading(false);
            return;
        }

        const fetchWatchlist = async () => {
            if (!session?.user?.id) return;

            try {
                // 1. Fetch watchlist IDs
                const watchlistRef = collection(db, "users", session.user.id, "watchlist");
                const snapshot = await getDocs(watchlistRef);

                if (snapshot.empty) {
                    setMovies([]);
                    setIsLoading(false);
                    return;
                }

                // 2. Fetch movie details for each ID
                const moviePromises = snapshot.docs.map(async (item) => {
                    const movieId = item.data().movieId;
                    if (!movieId) return null;
                    const movieDoc = await getDoc(doc(db, "videos", movieId));
                    if (movieDoc.exists()) {
                        return { id: movieDoc.id, ...movieDoc.data() } as Movie;
                    }
                    return null;
                });

                const movieResults = await Promise.all(moviePromises);
                setMovies(movieResults.filter((m): m is Movie => m !== null));

            } catch (error) {
                console.error("Error fetching watchlist", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWatchlist();
    }, [session, status]);

    if (status === "loading" || isLoading) {
        return (
            <div className="flex bg-[#0a0a0a] min-h-screen items-center justify-center pt-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#ff640a]" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] pt-20 space-y-4 px-4 text-center">
                <Bookmark className="h-16 w-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Sign in to view your Watchlist</h1>
                <p className="text-muted-foreground max-w-md">
                    Keep track of movies you want to watch. Access your list from any device.
                </p>
                <Button asChild className="bg-[#ff640a] hover:bg-[#e05200] text-white">
                    <Link href="/login">Sign In</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container-cmp pt-28 pb-20 space-y-8 min-h-screen">
            <h1 className="text-3xl font-bold">Your Watchlist</h1>

            {movies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map(movie => (
                        <div key={movie.id} className="relative group">
                            <MovieCard
                                id={movie.id}
                                image={movie.posterUrl || "/placeholder.jpg"}
                                title={movie.title}
                                year={movie.year?.toString() || "2024"}
                                genre={movie.genre || "Movie"}
                            />
                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <WatchlistButton movieId={movie.id} variant="icon" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center border rounded-lg border-[#23252b] bg-[#141519]">
                    <Bookmark className="h-12 w-12 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Your watchlist is empty</h2>
                    <p className="text-muted-foreground">Start adding movies to build your personal collection.</p>
                    <Button asChild variant="outline" className="border-[#ff640a] text-[#ff640a] hover:bg-[#ff640a]/10">
                        <Link href="/search">Browse Movies</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
