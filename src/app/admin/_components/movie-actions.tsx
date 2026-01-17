"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function MovieActions({ movieId }: { movieId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm("Are you sure you want to delete this movie?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/movies/delete?id=${movieId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.refresh();
            } else {
                console.error("Failed to delete movie");
                alert("Failed to delete movie");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <DropdownMenuItem
            className="text-red-500 hover:bg-[#23252b] cursor-pointer"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />}
            Delete Movie
        </DropdownMenuItem>
    )
}
