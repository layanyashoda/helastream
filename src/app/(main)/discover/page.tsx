import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, orderBy, doc, getDoc } from "firebase/firestore";
import { Movie } from "@/types";
import Banner from "../_components/banner";
import DataFeedRow from "../_components/dataFeedRow";
import { BannerItem } from "../_components/banner/index.types";
import { DataFeedItem } from "../_components/dataFeedRow/index.types";

const getBannerItems = async (): Promise<BannerItem[]> => {
    try {
        const moviesRef = collection(db, "videos");
        const q = query(moviesRef, where("isFeatured", "==", true));
        const snapshot = await getDocs(q);

        const items = snapshot.docs.map(doc => {
            const data = doc.data() as Movie;
            return {
                id: doc.id,
                title: data.title,
                banner: {
                    name: data.titleImageUrl || "",
                    tall: data.posterUrl || "",
                    wide: data.bannerImageUrl || "",
                },
                metaTags: [data.year?.toString() || "2024", "Movie"],
                genres: data.genre ? [data.genre] : ["Movie"],
                description: data.description || "",
                totalSeasons: 1,
                episodeId: doc.id,
                episodeTitle: "Full Movie",
                featuredOrder: data.featuredOrder ?? 9999, // Use default large number if undefined
            };
        });

        // Sort by featuredOrder
        items.sort((a, b) => a.featuredOrder - b.featuredOrder);

        return items;
    } catch (error) {
        console.error("Error fetching featured movies:", error);
        return [];
    }
};

const getRecentMovies = async (): Promise<DataFeedItem[]> => {
    try {
        const moviesRef = collection(db, "videos");
        const q = query(moviesRef, orderBy("uploadDate", "desc"), limit(10));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => {
            const data = doc.data() as Movie;
            return {
                id: doc.id,
                title: data.title,
                poster: { raw: data.posterUrl || "" },
                metaTags: [data.year?.toString() || "2024", "Movie"],
                averageRating: 4.5,
                totalRating: 100,
                description: data.description || "",
                totalSeasons: 1,
                totalEpisodes: 1,
                episodeId: doc.id,
                episodeTitle: "Full Movie",
            };
        });
    } catch (error) {
        console.error("Error fetching recent movies:", error);
        return [];
    }
};

const getContinueWatching = async (userId: string): Promise<DataFeedItem[]> => {
    try {
        const historyRef = collection(db, "users", userId, "history");
        const q = query(historyRef, orderBy("lastWatched", "desc"), limit(10));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return [];

        const promises = snapshot.docs.map(async (item) => {
            const data = item.data();
            const movieId = data.movieId;
            if (!movieId) return null;

            const movieDoc = await getDoc(doc(db, "videos", movieId));
            if (movieDoc.exists()) {
                const movieData = movieDoc.data() as Movie;
                return {
                    id: movieDoc.id,
                    title: movieData.title,
                    poster: { raw: movieData.posterUrl || "" },
                    metaTags: [movieData.year?.toString() || "2024", "Movie"],
                    averageRating: 4.5,
                    totalRating: 100,
                    description: movieData.description || "",
                    totalSeasons: 1,
                    totalEpisodes: 1,
                    episodeId: movieDoc.id,
                    episodeTitle: "Full Movie",
                };
            }
            return null;
        });

        const results = await Promise.all(promises);
        return results.filter((item): item is DataFeedItem => item !== null);

    } catch (error) {
        console.error("Error fetching continue watching:", error);
        return [];
    }
};

import { auth } from "@/auth";

export default async function DiscoverPage() {
    const session = await auth();
    const bannerItems = await getBannerItems();
    const recentMovies = await getRecentMovies();
    const continueWatching = session?.user?.id ? await getContinueWatching(session.user.id) : [];

    // Reuse recent movies for "Top Picks" for now
    const topPicks = [...recentMovies].sort(() => 0.5 - Math.random());

    return (
        <>
            <main className="feed relative grid gap-y-12 sm:gap-y-[4.5rem] xl:gap-y-24">
                {bannerItems.length > 0 ? (
                    <Banner bannerItems={bannerItems} />
                ) : (
                    <div className="h-[50vh] flex items-center justify-center text-white">
                        <p>No featured movies available. Add some from Admin Dashboard.</p>
                    </div>
                )}

                <div
                    className="dynamic-feed grid gap-y-10"
                    style={{ gridTemplateColumns: "minmax(0, auto)" }}
                >
                    {continueWatching.length > 0 && (
                        <DataFeedRow
                            dataTitle="Continue Watching"
                            dataSubTitle="Pick up where you left off"
                            dataFeed={continueWatching}
                        />
                    )}

                    {topPicks.length > 0 && (
                        <DataFeedRow dataTitle="Top Picks for You" dataFeed={topPicks} />
                    )}

                    {recentMovies.length > 0 && (
                        <DataFeedRow
                            dataTitle="Recently Added"
                            dataSubTitle="Fresh arrivals on HelaStream"
                            dataFeed={recentMovies}
                        />
                    )}
                </div>
            </main>
        </>
    );
}
