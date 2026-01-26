"use client";

import Link from "next/link";

import { cleanString, getCompactNotation, getReadableDate } from "@/lib/utils";

import AverageRating from "@/components/ratings/averageRating";
import { WatchlistButton } from "@/components/watchlist-button";
import Details from "../details";

import {
    AddToWatchListOutlined,
    AddToWatchListFilled,
} from "@/assets/addToWatchListIcons";
import {
    ThumbUpOutlined,
    ThumbUpFilled,
    ThumbDownOutlined,
    ThumbDownFilled,
} from "@/assets/watch/thumbIcons";

import "./index.css";

const CurrentMedia: React.FC<{
    movieId: string;
    seriesId: string;
    seriesTitle: string;
    averageRating: number;
    totalRating: number;
    title: string;
    metaTags: string[];
    releaseDate: string;
    likes: number;
    dislikes: number;
    description: string;
    details: Record<string, string>;
}> = ({
    movieId,
    seriesId,
    seriesTitle,
    averageRating,
    totalRating,
    title,
    metaTags,
    releaseDate,
    likes,
    dislikes,
    description,
    details,
}) => {
        const seriesLink = `/series/${seriesId}/${cleanString(seriesTitle)}`;

        const compactLikes = getCompactNotation(likes);
        const compactDislikes = getCompactNotation(dislikes);

        const readableReleaseDate = getReadableDate(releaseDate);

        return (
            <div className="current-media mb-6">
                <div className="current-media-info flex-1">

                    {/* Header Section */}
                    <div className="mb-4">
                        <Link
                            href={seriesLink}
                            prefetch={false}
                            className="show-title-link text-[var(--app-background-crunchyroll-orange)] hover:underline block mb-1"
                        >
                            <h4 className="text-sm font-semibold uppercase tracking-wide">{seriesTitle}</h4>
                        </Link>

                        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                                <AverageRating
                                    align="left"
                                    mode="compact"
                                    averageRating={averageRating}
                                    totalRating={totalRating}
                                />
                            </div>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span>{readableReleaseDate}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <div className="flex gap-2">
                                {metaTags.map((tag, i) => (
                                    <span key={i} className="bg-[#23252b] px-2 py-0.5 rounded text-xs text-gray-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between border-y border-[#23252b] py-3 mb-6">
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                <div className="current-media-action-button">
                                    <ThumbUpOutlined />
                                    <ThumbUpFilled />
                                </div>
                                <span className="text-sm font-medium">{compactLikes}</span>
                            </button>

                            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                <div className="current-media-action-button">
                                    <ThumbDownOutlined />
                                    <ThumbDownFilled />
                                </div>
                                <span className="text-sm font-medium">Dislike</span>
                            </button>

                            <WatchlistButton movieId={movieId} />
                        </div>

                        {/* Share could go here */}
                    </div>

                    <Details description={description} details={details} />
                </div>
            </div>
        );
    };

export default CurrentMedia;
