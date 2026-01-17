"use client"

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Movie } from "@/types";
import { MovieCard } from "@/components/movie-card";
import { WatchlistButton } from "@/components/watchlist-button";

interface SearchInterfaceProps {
    movies: Movie[];
    genres: { id: string, name: string }[];
}

export function SearchInterface({ movies, genres }: SearchInterfaceProps) {
    const [query, setQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    const filteredMovies = useMemo(() => {
        return movies.filter(movie => {
            const matchesQuery = movie.title.toLowerCase().includes(query.toLowerCase());
            const matchesGenre = selectedGenre ? movie.genre === selectedGenre : true;
            return matchesQuery && matchesGenre;
        });
    }, [query, selectedGenre, movies]);

    return (
        <div className="space-y-8">
            {/* Search Controls */}
            <div className="space-y-6">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for movies..."
                        className="pl-12 h-14 text-lg bg-[#141519] border-[#23252b] rounded-full focus-visible:ring-[#ff640a]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    <Badge
                        variant={selectedGenre === null ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-colors ${selectedGenre === null ? 'bg-[#ff640a] hover:bg-[#ff640a]/90' : 'hover:bg-[#23252b]'}`}
                        onClick={() => setSelectedGenre(null)}
                    >
                        All
                    </Badge>
                    {genres.map(genre => (
                        <Badge
                            key={genre.id}
                            variant={selectedGenre === genre.name ? "default" : "outline"}
                            className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-colors ${selectedGenre === genre.name ? 'bg-[#ff640a] hover:bg-[#ff640a]/90' : 'hover:bg-[#23252b]'}`}
                            onClick={() => setSelectedGenre(genre.name === selectedGenre ? null : genre.name)}
                        >
                            {genre.name}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMovies.map(movie => (
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

            {filteredMovies.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg">No movies found matching your criteria.</p>
                </div>
            )}
        </div>
    )
}
