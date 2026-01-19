
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Movie } from "@/types";
import DataFeedRow from "../_components/dataFeedRow";
import { DataFeedItem } from "../_components/dataFeedRow/index.types";

const getRecentMovies = async (): Promise<DataFeedItem[]> => {
    try {
        const moviesRef = collection(db, "videos");
        const q = query(moviesRef, orderBy("uploadDate", "desc"), limit(20)); // Limit to 20 for the "New" page
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

export default async function NewPage() {
    const recentMovies = await getRecentMovies();

    return (
        <main className="feed relative grid gap-y-12 sm:gap-y-[4.5rem] xl:gap-y-24 pt-24">
            <div className="container px-4 md:px-6">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-black mb-4">New Releases</h1>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        Fresh releases, just for you. Catch up on the latest additions to HelaTV+.
                    </p>
                </div>

                {recentMovies.length > 0 ? (
                    <div className="dynamic-feed grid gap-y-10" style={{ gridTemplateColumns: "minmax(0, auto)" }}>
                        <DataFeedRow
                            dataTitle="Just Added"
                            dataSubTitle="The absolute newest content on the platform"
                            dataFeed={recentMovies}
                        />
                    </div>
                ) : (
                    <div className="h-[40vh] flex items-center justify-center text-white/50">
                        <p>No new movies available at the moment.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
