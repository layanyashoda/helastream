"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Movie } from "@/types"; // Assuming this type exists, otherwise need to define locally or import
import { Loader2 } from "lucide-react";

export default function CategoryPage() {
    const params = useParams();
    const genre = decodeURIComponent(params.slug as string);
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMovies() {
            setLoading(true);
            try {
                const q = query(collection(db, "videos"), where("genre", "==", genre));
                const querySnapshot = await getDocs(q);
                const fetchedMovies: any[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedMovies.push({ id: doc.id, ...doc.data() });
                });
                setMovies(fetchedMovies);
            } catch (error) {
                console.error("Error fetching movies by genre:", error);
            } finally {
                setLoading(false);
            }
        }

        if (genre) {
            fetchMovies();
        }
    }, [genre]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="size-10 animate-spin text-[var(--app-background-crunchyroll-orange)]" />
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="mb-8 border-l-4 border-[var(--app-background-crunchyroll-orange)] pl-4">
                <h1 className="text-3xl font-bold text-white capitalize">{genre} Anime</h1>
                <p className="text-gray-400 mt-1">Explore our collection of {genre} series and movies.</p>
            </div>

            {movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {movies.map((movie) => (
                        <Link href={`/watch/${movie.id}/${movie.title}`} key={movie.id} className="group relative block aspect-[2/3] overflow-hidden rounded-md bg-[#23252b]">
                            <div className="relative size-full">
                                {movie.posterUrl ? (
                                    <img
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-500">
                                        {movie.title}
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                                <h3 className="text-white font-bold truncate text-lg shadow-black drop-shadow-md">{movie.title}</h3>
                                <p className="text-xs text-gray-300 line-clamp-2 mt-1">{movie.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 mt-20">
                    <p className="text-xl">No movies found in "{genre}"</p>
                </div>
            )}
        </main>
    );
}
