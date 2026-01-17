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
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function MoviesPage() {
    let movies: Movie[] = [];
    try {
        const moviesRef = collection(db, "videos"); // "videos" collection
        const q = query(moviesRef, orderBy("uploadDate", "desc"));
        const snapshot = await getDocs(q);

        movies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as any)
        }));
    } catch (e) {
        console.error("Failed to fetch movies", e);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Movies Library</h1>
                    <p className="text-muted-foreground">Manage your movie catalog and assets.</p>
                </div>
                <Link href="/admin/movies/add">
                    <Button className="bg-[#ff640a] hover:bg-[#e05200] text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Movie
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search movies..."
                        className="pl-8 bg-[#141519] border-[#23252b]"
                    />
                </div>
            </div>

            <div className="bg-[#141519] rounded-lg shadow border border-[#23252b]">
                <Table>
                    <TableHeader>
                        <TableRow className="border-[#23252b] hover:bg-[#23252b]">
                            <TableHead className="text-muted-foreground w-[80px]">Poster</TableHead>
                            <TableHead className="text-muted-foreground">Title</TableHead>
                            <TableHead className="text-muted-foreground">Genre</TableHead>
                            <TableHead className="text-muted-foreground">Year</TableHead>
                            <TableHead className="text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movies.map((movie) => (
                            <TableRow key={movie.id} className="border-[#23252b] hover:bg-[#23252b]">
                                <TableCell>
                                    <div className="h-12 w-8 bg-[#23252b] rounded overflow-hidden">
                                        {movie.posterUrl ? (
                                            <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">n/a</div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-foreground">
                                    <div className="flex flex-col">
                                        <span>{movie.title}</span>
                                        {movie.isFeatured && (
                                            <span className="text-xs text-[#ff640a] bg-[#ff640a]/10 px-1 rounded w-fit mt-1">Featured</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {movie.genre || "-"}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {movie.year || "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={movie.status === "Ready" ? "default" : "secondary"} className={movie.status === "Processing" ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" : "bg-green-500/20 text-green-500 hover:bg-green-500/30"}>
                                        {movie.status}
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
                                            <DropdownMenuItem className="hover:bg-[#23252b] cursor-pointer">Edit Movie</DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-[#23252b]" />
                                            <DropdownMenuItem className="text-red-500 hover:bg-[#23252b] cursor-pointer">Delete</DropdownMenuItem>
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
