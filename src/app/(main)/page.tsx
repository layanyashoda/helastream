import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { Movie } from "@/types";
import Banner from "./_components/banner";
import DataFeedRow from "./_components/dataFeedRow";
import { BannerItem } from "./_components/banner/index.types";
import { DataFeedItem } from "./_components/dataFeedRow/index.types";

const getBannerItems = async (): Promise<BannerItem[]> => {
  try {
    const moviesRef = collection(db, "videos");
    const q = query(moviesRef, where("isFeatured", "==", true));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
      const data = doc.data() as Movie;
      return {
        id: doc.id,
        title: data.title,
        banner: {
          name: data.titleImageUrl || "", // Fallback or handle empty
          tall: data.posterUrl || "",
          wide: data.bannerImageUrl || "",
        },
        metaTags: [data.year?.toString() || "2024", "Movie"], // Default tags
        genres: data.genre ? [data.genre] : ["Movie"],
        description: data.description || "",
        totalSeasons: 1, // Movies don't have seasons, implies Single
        episodeId: doc.id, // ID to link to player
        episodeTitle: "Full Movie",
      };
    });
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
        averageRating: 4.5, // Placeholder
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

export default async function Home() {
  const bannerItems = await getBannerItems();
  const recentMovies = await getRecentMovies();
  // Reuse recent movies for "Top Picks" for now, or randomize
  const topPicks = [...recentMovies].sort(() => 0.5 - Math.random());

  return (
    <>
      <main className="feed relative grid gap-y-12 sm:gap-y-[4.5rem] xl:gap-y-24">
        {bannerItems.length > 0 ? (
          <Banner bannerItems={bannerItems} />
        ) : (
          // Optional: Show a placeholder or nothing if no featured movies
          <div className="h-[50vh] flex items-center justify-center text-white">
            <p>No featured movies available. Add some from Admin Dashboard.</p>
          </div>
        )}

        <div
          className="dynamic-feed grid gap-y-10"
          style={{ gridTemplateColumns: "minmax(0, auto)" }}
        >
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

      <footer></footer>
    </>
  );
}
