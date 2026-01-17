"use client";

import { useState, useEffect } from "react";
import { HiSearch } from "react-icons/hi";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get("q") || "";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Handle debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Update URL when debounced query changes
    useEffect(() => {
        if (debouncedQuery) {
            router.replace(`/search?q=${encodeURIComponent(debouncedQuery)}`);
        } else {
            router.replace("/search");
        }
    }, [debouncedQuery, router]);

    // Fetch and filter movies
    useEffect(() => {
        async function fetchMovies() {
            setLoading(true);
            try {
                // Fetch all movies and filter client side for better text search capability
                // In a production environment with massive data, this should be a backend function (e.g. Algolia or ElasticSearch)
                const q = query(collection(db, "videos"));
                const querySnapshot = await getDocs(q);

                const allMovies: any[] = [];
                querySnapshot.forEach((doc) => {
                    allMovies.push({ id: doc.id, ...doc.data() });
                });

                if (!debouncedQuery) {
                    setMovies(allMovies);
                } else {
                    const lowerQuery = debouncedQuery.toLowerCase();
                    const filtered = allMovies.filter(movie =>
                        movie.title?.toLowerCase().includes(lowerQuery) ||
                        movie.genre?.toLowerCase().includes(lowerQuery)
                    );
                    setMovies(filtered);
                }

            } catch (error) {
                console.error("Error searching movies:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();
    }, [debouncedQuery]);


    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchQuery(e.target.value);
    }

    return (
        <main className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiSearch className="size-6 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 bg-[#23252b] border border-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[var(--app-background-crunchyroll-orange)] transition-colors text-lg"
                    placeholder="Search for anime..."
                    value={searchQuery}
                    onChange={handleSearch}
                    autoFocus
                />
            </div>

            {loading ? (
                <div className="flex justify-center mt-20">
                    <Loader2 className="size-10 animate-spin text-[var(--app-background-crunchyroll-orange)]" />
                </div>
            ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {movies.map((movie) => (
                        <Link href={`/watch/${movie.id}/${encodeURIComponent(movie.title)}`} key={movie.id} className="group relative block aspect-[2/3] overflow-hidden rounded-md bg-[#23252b]">
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
                                <p className="text-xs text-gray-300 line-clamp-2 mt-1">{movie.genre}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-400 mt-20">
                    <p className="text-xl">No results found for "{debouncedQuery}"</p>
                </div>
            )}
        </main>
    )
}
