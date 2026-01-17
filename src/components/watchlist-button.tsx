"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Check } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
    movieId: string;
    className?: string;
    variant?: "default" | "icon";
}

export function WatchlistButton({ movieId, className, variant = "default" }: WatchlistButtonProps) {
    const { data: session } = useSession();
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!session?.user?.id || !movieId) return;

        const checkWatchlist = async () => {
            // ensure user id exists
            if (!session.user?.id) return;
            const docRef = doc(db, "users", session.user.id, "watchlist", movieId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setIsInWatchlist(true);
            }
        };
        checkWatchlist();
    }, [session?.user?.id, movieId]);

    const toggleWatchlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session?.user) {
            // Redirect to login or show auth modal (optional)
            alert("Please login to add to watchlist");
            return;
        }

        setIsLoading(true);
        const userId = session.user.id!;
        const docRef = doc(db, "users", userId, "watchlist", movieId);

        try {
            if (isInWatchlist) {
                await deleteDoc(docRef);
                setIsInWatchlist(false);
            } else {
                await setDoc(docRef, {
                    movieId: movieId,
                    addedAt: serverTimestamp()
                });
                setIsInWatchlist(true);
            }
        } catch (error) {
            console.error("Error updating watchlist", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (variant === "icon") {
        return (
            <button
                onClick={toggleWatchlist}
                disabled={isLoading}
                className={cn(
                    "p-2 rounded-full transition-colors backdrop-blur-md shadow-lg",
                    isInWatchlist ? "text-[#ff640a] bg-black/60" : "text-white bg-black/40 hover:bg-black/60",
                    className
                )}
                title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
                {isInWatchlist ? <Check className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>
        );
    }

    return (
        <Button
            onClick={toggleWatchlist}
            disabled={isLoading}
            variant="outline"
            className={cn(
                "gap-2",
                isInWatchlist ? "border-[#ff640a] text-[#ff640a]" : "border-white text-white",
                className
            )}
        >
            {isInWatchlist ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </Button>
    );
}
