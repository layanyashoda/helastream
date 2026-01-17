"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Genre {
    id: string;
    name: string;
}

export function GenreList({ initialGenres }: { initialGenres: Genre[] }) {
    const [genres, setGenres] = useState(initialGenres);
    const [newGenre, setNewGenre] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const router = useRouter();

    const handleAdd = async () => {
        if (!newGenre.trim()) return;
        setIsAdding(true);
        try {
            const res = await fetch("/api/genres", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newGenre })
            });

            if (res.ok) {
                const added = await res.json();
                setGenres([...genres, added]);
                setNewGenre("");
                router.refresh();
            }
        } catch (e) {
            console.error("Failed to add genre");
        } finally {
            setIsAdding(false);
        }
    }

    const handleDelete = async (id: string) => {
        if (!process.env.NEXT_PUBLIC_ALLOW_GENRE_DELETE && !confirm("Delete this genre?")) return;
        setIsDeleting(id);

        try {
            const res = await fetch(`/api/genres/${id}`, { method: "DELETE" });
            if (res.ok) {
                setGenres(genres.filter(g => g.id !== id));
                router.refresh();
            }
        } catch (e) {
            console.error("Failed to delete genre");
        } finally {
            setIsDeleting(null);
        }
    }

    return (
        <div className="max-w-xl space-y-6">
            <div className="flex gap-4">
                <Input
                    placeholder="New Genre Name (e.g. Action, Sci-Fi)"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Button onClick={handleAdd} disabled={isAdding || !newGenre.trim()} className="bg-[#ff640a] hover:bg-[#e05200] text-white">
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add
                </Button>
            </div>

            <div className="bg-[#141519] rounded-lg border border-[#23252b] divide-y divide-[#23252b]">
                {genres.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No genres found.</div>
                ) : (
                    genres.map(genre => (
                        <div key={genre.id} className="p-4 flex items-center justify-between hover:bg-[#23252b]/50 group">
                            <span className="font-medium">{genre.name}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(genre.id)}
                                disabled={isDeleting === genre.id}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                                {isDeleting === genre.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
