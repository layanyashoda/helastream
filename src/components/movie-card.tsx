"use client"

import { TiltCard } from "@/components/ui/tilt-card";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { cleanString } from "@/lib/utils";

interface MovieCardProps {
    id: string;
    title: string;
    image: string;
    year?: string;
    genre?: string;
    rating?: number;
}

export function MovieCard({ id, title, image, year, genre, rating = 4.5 }: MovieCardProps) {
    const movieLink = `/watch/${id}/${cleanString(title)}`;

    return (
        <TiltCard className="h-full w-full rounded-md overflow-hidden group relative">
            <Link href={movieLink} className="block h-full w-full aspect-[2/3] relative">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-white font-bold truncate text-lg shadow-black drop-shadow-md leading-tight mb-1">{title}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-300">
                        <span>{year} • {genre}</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{rating}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </TiltCard>
    )
}
