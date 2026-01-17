import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Movie } from "@/types";
import { Episode } from "@/app/(main)/watch/[id]/[title]/page.types";

const fallbackImage = "/placeholder.jpg"; // You might want a real asset import

export async function getEpisode(id: string): Promise<Episode> {
    try {
        const docRef = doc(db, "videos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as Movie;

            return {
                episode: "1", // Movies are single episode
                title: data.title,
                thumbnail: data.posterUrl || fallbackImage,
                duration: 0, // We might not have duration unless metadata extracted
                metaTags: [data.year?.toString() || "2024", data.genre || "Movie"],
                releaseDate: data.uploadDate ? new Date(data.uploadDate).toISOString() : new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                description: data.description || "",
                details: {
                    Genre: data.genre || "Movie",
                    Year: data.year?.toString() || ""
                },
                media: data.videoUrl || "", // This should be the HLS URL or direct link
                series: {
                    id: id,
                    title: data.title,
                    averageRating: 5.0,
                    totalRating: 1
                },
                prevEpisode: null,
                nextEpisode: null
            };
        }
    } catch (error) {
        console.error("Error fetching episode:", error);
    }

    // Return a default/fallback or throw
    throw new Error("Movie not found");
}

export async function getTitle(id: string): Promise<{ seriesTitle: string; episodeTitle: string }> {
    try {
        const docRef = doc(db, "videos", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as Movie;
            return {
                seriesTitle: data.title,
                episodeTitle: "Full Movie"
            };
        }
    } catch (e) {
        console.error(e);
    }
    return {
        seriesTitle: "Unknown Title",
        episodeTitle: "Movie"
    };
}

export default getEpisode;

