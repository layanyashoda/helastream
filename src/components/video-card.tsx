import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import Link from "next/link"

interface VideoCardProps {
    id: string
    title: string
    thumbnailUrl: string
    status: "Processing" | "Ready" | "Error"
    uploadDate: Date
}

export function VideoCard({ id, title, thumbnailUrl, status, uploadDate }: VideoCardProps) {
    return (
        <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                {/* Placeholder or real image */}
                <img
                    src={thumbnailUrl || "https://placehold.co/600x400/png?text=Video+Thumbnail"}
                    alt={title}
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity duration-300">
                    <Play className="w-12 h-12 text-white fill-current" />
                </div>
            </div>
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg truncate" title={title}>{title}</CardTitle>
                    <Badge variant={status === "Ready" ? "default" : "secondary"}>
                        {status}
                    </Badge>
                </div>
                <CardDescription>{new Date(uploadDate).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                {/* Additional metadata if needed */}
            </CardContent>
            <CardFooter className="p-4 pt-0">
                {status === "Ready" ? (
                    <Link href={`/watch/${id}`} className="w-full">
                        {/* Could be a button here, or the whole card is clickable */}
                    </Link>
                ) : (
                    <span className="text-sm text-muted-foreground">Video is processing...</span>
                )}
            </CardFooter>
        </Card>
    )
}
