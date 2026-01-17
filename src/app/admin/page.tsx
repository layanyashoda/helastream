import { auth } from "@/auth";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Movie } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminStats } from "./_components/admin-stats";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react";
import { UploadVideoDialog } from "./_components/upload-video-dialog";
import { MovieActions } from "./_components/movie-actions";
import Link from "next/link";

import { UserGrowthChart } from "./_components/analytics/user-growth-chart";
import { ContentDistributionChart } from "./_components/analytics/content-distribution-chart";
import { StorageUsageChart } from "./_components/analytics/storage-usage-chart";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const session = await auth();

    // Fetch Videos
    let videos: Movie[] = [];
    try {
        const videosRef = collection(db, "videos");
        const q = query(videosRef, orderBy("uploadDate", "desc"));
        const snapshot = await getDocs(q);

        videos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as any)
        }));
    } catch (e) {
        console.error("Failed to fetch videos", e);
    }

    // Aggregate Genres
    const genreCounts: Record<string, number> = {};
    videos.forEach(v => {
        const g = v.genre || "Unknown";
        genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
    const genreDistribution = Object.keys(genreCounts).map(g => ({ name: g, value: genreCounts[g] }));

    // Fetch Users (Aggregation for growth)
    let activeUsers = 0;
    const userGrowth: Record<string, number> = {};

    try {
        const usersRef = collection(db, "users");
        const userSnapshot = await getDocs(usersRef);
        activeUsers = userSnapshot.size;

        // Mocking growth data based on total users for demo (distributing them over last 7 days randomly)
        // In real app, we would use doc.data().createdAt
        const dates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        dates.forEach(d => userGrowth[d] = 0);

        // Simple distribution for demo
        let remaining = activeUsers;
        dates.forEach((d, i) => {
            if (i === dates.length - 1) {
                userGrowth[d] = remaining; // Put rest in today
            } else {
                const count = Math.floor(Math.random() * (remaining / 2));
                userGrowth[d] = count;
                remaining -= count;
            }
        });

    } catch (e) {
        console.error("Failed to fetch users", e);
    }

    const userGrowthData = Object.keys(userGrowth).map(d => ({ date: d, users: userGrowth[d] }));


    const totalMovies = videos.length;
    const processingMovies = videos.filter(v => v.status === "Processing").length;
    const featuredMovies = videos.filter(v => v.isFeatured).length;
    // const readyMovies = videos.filter(v => v.status === "Ready").length; // Not used in stats anymore based on request

    // Calculate Storage
    const totalBytes = videos.reduce((acc, v) => acc + (v.size || 0), 0);
    const totalGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
    const storageData = [
        { name: "Movies", size: parseFloat(totalGB) },
        { name: "Other", size: 1.2 } // Mock other assets
    ];

    return (
        <div className="space-y-6">
            <AdminStats
                totalMovies={totalMovies}
                processingMovies={processingMovies}
                featuredMovies={featuredMovies}
                activeUsers={activeUsers}
                totalStorage={`${totalGB} GB`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
                <div className="lg:col-span-4 space-y-6">
                    <UserGrowthChart data={userGrowthData} />
                    <StorageUsageChart data={storageData} />
                </div>
                <div className="lg:col-span-3">
                    <ContentDistributionChart data={genreDistribution} />
                </div>
            </div>

            <div className="bg-[#141519] rounded-lg shadow border border-[#23252b]">
                <div className="p-6 border-b border-[#23252b] flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Movie Management</h2>
                        <p className="text-sm text-muted-foreground">Manage your movie catalog and assets.</p>
                    </div>
                    {/* Replaced Upload with Link to Add Movie or keep UploadVideoDialog if you want quick upload */}
                    <Link href="/admin/movies/add">
                        <Button className="bg-[#ff640a] hover:bg-[#e05200] text-white">
                            Add Movie
                        </Button>
                    </Link>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="border-[#23252b] hover:bg-[#23252b]">
                            <TableHead className="text-muted-foreground">Title</TableHead>
                            <TableHead className="text-muted-foreground">Upload Date</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.slice(0, 5).map((video) => (
                            <TableRow key={video.id} className="border-[#23252b] hover:bg-[#23252b]">
                                <TableCell className="font-medium text-foreground">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-[#23252b] rounded flex items-center justify-center overflow-hidden">
                                            {video.posterUrl ? (
                                                <img src={video.posterUrl} alt="Poster" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400">MOV</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{video.title || video.filename}</span>
                                            {video.isFeatured && <span className="text-[10px] text-[#ff640a] uppercase tracking-wider">Featured</span>}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(video.uploadDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={video.status === "Ready" ? "default" : "secondary"} className={video.status === "Processing" ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" : "bg-green-500/20 text-green-500 hover:bg-green-500/30"}>
                                        {video.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#23252b]">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#141519] border-[#23252b] text-white">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="hover:bg-[#23252b] cursor-pointer">Copy Video ID</DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-[#23252b]" />
                                            <DropdownMenuItem asChild className="hover:bg-[#23252b] cursor-pointer">
                                                <Link href={`/admin/movies/edit/${video.id}`}>Edit Movie</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-[#23252b]" />
                                            <MovieActions movieId={video.id} />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="p-4 border-t border-[#23252b] text-center">
                    <Link href="/admin/movies">
                        <Button variant="ghost" className="text-muted-foreground hover:text-white">View All Movies</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
