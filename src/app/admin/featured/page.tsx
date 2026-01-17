import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Movie } from "@/types";
import { FeaturedList } from "./_components/featured-list";

export const dynamic = 'force-dynamic';

export default async function FeaturedPage() {
    let featuredMovies: Movie[] = [];
    try {
        const moviesRef = collection(db, "videos");
        // We want to fetch all movies where isFeatured is true.
        // We'll sort them by 'featuredOrder' if it exists, otherwise by uploadDate or something consistent.
        // Note: You might need a composite index for 'isFeatured' + 'featuredOrder'.
        // For now, we'll sort in client or try basic sorting.
        const q = query(moviesRef, where("isFeatured", "==", true));
        const snapshot = await getDocs(q);

        featuredMovies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as any)
        }));

        // Sort manually if index issues arise, or prompt user to create index.
        // Sorting by featuredOrder (asc), treating undefined as infinity (put at end)
        featuredMovies.sort((a, b) => {
            const orderA = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
            const orderB = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
        });

    } catch (e) {
        console.error("Failed to fetch featured movies", e);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Featured Content</h1>
                <p className="text-muted-foreground">Manage and reorder the movies shown in the home page carousel.</p>
            </div>

            <FeaturedList initialMovies={featuredMovies} />
        </div>
    )
}
