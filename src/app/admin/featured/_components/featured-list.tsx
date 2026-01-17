"use client"

import { useState } from "react";
import { Movie } from "@/types";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from "./sortable-item";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface FeaturedListProps {
    initialMovies: Movie[];
}

export function FeaturedList({ initialMovies }: FeaturedListProps) {
    const [movies, setMovies] = useState(initialMovies);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setMovies((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const handleSaveOrder = async () => {
        setIsSaving(true);
        try {
            // Prepare payload: array of { id, featuredOrder }
            const updates = movies.map((movie, index) => ({
                id: movie.id,
                featuredOrder: index
            }));

            const res = await fetch('/api/featured/reorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates })
            });

            if (!res.ok) throw new Error("Failed to save order");

            router.refresh();
        } catch (error) {
            console.error("Error saving order:", error);
            alert("Failed to save order");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    onClick={handleSaveOrder}
                    disabled={isSaving}
                    className="bg-[#ff640a] hover:bg-[#e05200] text-white"
                >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Order
                </Button>
            </div>

            <div className="bg-[#141519] rounded-lg border border-[#23252b] p-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={movies.map(m => m.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {movies.map((movie) => (
                                <SortableItem key={movie.id} id={movie.id} movie={movie} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {movies.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No featured movies found. Go to Movies library to add some.
                    </div>
                )}
            </div>
        </div>
    );
}
