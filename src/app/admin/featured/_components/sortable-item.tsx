"use client"

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Movie } from "@/types";
import { GripVertical, X } from "lucide-react";
import { Button } from '@/components/ui/button';

export function SortableItem({ id, movie }: { id: string, movie: Movie }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleRemove = async (e: React.MouseEvent) => {
        // Prevent drag when clicking remove
        e.stopPropagation();
        if (!confirm(`Remove "${movie.title}" from Featured?`)) return;

        // Call API to remove featured status
        try {
            const res = await fetch(`/api/movies/update?id=${movie.id}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFeatured: false })
            });
            if (res.ok) {
                // We rely on parent refresh or optimistic update. 
                // For simplicity, we just reload page or let parent re-fetch.
                // Or better, let's just do a router refresh in parent.
                // Actually parent (FeaturedList) controls state. Ideally we pass a callback.
                // For now quick window reload or let's pass a callback later. 
                // Let's just do window.location.reload() for MVP 
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-[#23252b] p-3 rounded-md group">
            <div {...attributes} {...listeners} className="cursor-grab hover:text-[#ff640a] text-muted-foreground">
                <GripVertical className="h-5 w-5" />
            </div>

            <div className="h-10 w-16 bg-black/40 rounded overflow-hidden flex-shrink-0">
                {movie.bannerImageUrl ? (
                    <img src={movie.bannerImageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{movie.title}</p>
                <p className="text-xs text-muted-foreground">{movie.genre} • {movie.year}</p>
            </div>

            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 hover:bg-black/20" onPointerDown={(e) => e.stopPropagation()} onClick={handleRemove}>
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}
