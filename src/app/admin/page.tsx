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

    // Fetch Users count
    let activeUsers = 0;
    try {
        const usersRef = collection(db, "users");
        const userSnapshot = await getDocs(usersRef);
        activeUsers = userSnapshot.size;
        // Or if we want strictly "active" status:
        // activeUsers = userSnapshot.docs.filter(d => d.data().status === 'active').length;
    } catch (e) {
        console.error("Failed to fetch users", e);
    }

    const totalMovies = videos.length;
    const processingMovies = videos.filter(v => v.status === "Processing").length;
    const featuredMovies = videos.filter(v => v.isFeatured).length;
    // const readyMovies = videos.filter(v => v.status === "Ready").length; // Not used in stats anymore based on request

    return (
        <div className="space-y-6">
            <AdminStats
                totalMovies={totalMovies}
                processingMovies={processingMovies}
                featuredMovies={featuredMovies}
                activeUsers={activeUsers}
                totalStorage="45.2 GB"
            />

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
                        {videos.map((video) => (
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
                                            <DropdownMenuItem className="hover:bg-[#23252b] cursor-pointer">View Details</DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-[#23252b]" />
                                            <MovieActions movieId={video.id} />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
