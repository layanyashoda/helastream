"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UploadCloud } from "lucide-react";
import { Movie } from "@/types";

export default function AddMoviePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState("");

    const [isFeatured, setIsFeatured] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        year: new Date().getFullYear(),
        genre: "",
    });

    const [genres, setGenres] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetch("/api/genres");
                if (res.ok) {
                    const data = await res.json();
                    setGenres(data);
                }
            } catch (e) {
                console.error("Failed to load genres", e);
            }
        };
        fetchGenres();
    }, []);

    const [files, setFiles] = useState<{
        video: File | null;
        poster: File | null;
        titleImage: File | null;
        bannerImage: File | null;
    }>({
        video: null,
        poster: null,
        titleImage: null,
        bannerImage: null
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    const uploadFile = async (file: File, path: string): Promise<string> => {
        if (!file) return "";
        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${p}% done`);
                    // We could aggregate progress here if we wanted strictly accurate total progress
                },
                (error) => reject(error),
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!files.video || !files.poster) {
            alert("Video and Poster are required!");
            return;
        }

        if (isFeatured && (!files.titleImage || !files.bannerImage)) {
            alert("Featured movies require Title Image and Banner Image!");
            return;
        }

        setIsLoading(true);
        setStatusMessage("Initializing...");

        try {
            // 1. Generate the Movie ID first so we can use it in the folder path
            const docRef = doc(collection(db, "videos"));
            const movieId = docRef.id;

            // Upload Video to 'videos/{movieId}/...'
            setStatusMessage("Uploading video file...");
            // This will result in: videos/{movieId}/{timestamp}_{filename}
            // Which matches the Cloud Function expectation: videos/{movieId}/{filename}
            const videoUrl = await uploadFile(files.video, `videos/${movieId}`);

            // Upload Poster
            setStatusMessage("Uploading poster...");
            const posterUrl = await uploadFile(files.poster, "images");

            // Upload Featured Assets
            let titleImageUrl = "";
            let bannerImageUrl = "";

            if (isFeatured) {
                setStatusMessage("Uploading featured assets...");
                titleImageUrl = await uploadFile(files.titleImage!, "images");
                bannerImageUrl = await uploadFile(files.bannerImage!, "images");
            }

            // Save Metadata
            setStatusMessage("Saving movie details...");
            const movieData: Omit<Movie, "id"> = {
                title: formData.title,
                description: formData.description,
                year: Number(formData.year),
                genre: formData.genre,
                status: "Ready", // Set default status to Ready since we don't have a transcoding backend yet
                videoUrl, // This will be the RAW mp4 url initially. Cloud function will update it to HLS later.
                thumbnailUrl: posterUrl, // Fallback to poster
                posterUrl,
                isFeatured,
                ...(isFeatured ? { titleImageUrl: titleImageUrl, bannerImageUrl: bannerImageUrl } : {}),
                filename: files.video.name,
                size: files.video.size,
                uploadDate: new Date().toISOString()
            };

            // Use setDoc with the generated reference
            await setDoc(docRef, movieData);

            setStatusMessage("Done!");
            router.push("/admin/movies");
            router.refresh();

        } catch (error) {
            console.error("Upload failed", error);
            setStatusMessage("Error uploading movie.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Add New Movie</h1>
                <p className="text-muted-foreground">Upload a new movie and define its metadata.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="bg-[#141519] border-[#23252b]">
                    <CardHeader>
                        <CardTitle>Movie Details</CardTitle>
                        <CardDescription>Basic information about the movie.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Movie Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Movie Plot Summary..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="h-32"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="year">Year</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="genre">Genre</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, genre: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Genre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genres.length > 0 ? (
                                            genres.map((g) => (
                                                <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="disabled" disabled>Loading genres...</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#141519] border-[#23252b]">
                    <CardHeader>
                        <CardTitle>Media Assets</CardTitle>
                        <CardDescription>Upload video file and posters.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="video">Video File (MP4)</Label>
                            <div className="border-2 border-dashed border-[#23252b] rounded-lg p-6 hover:bg-[#23252b]/50 transition-colors cursor-pointer relative">
                                <Input
                                    id="video"
                                    type="file"
                                    accept="video/mp4,video/webm"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={e => handleFileChange(e, "video")}
                                    required
                                />
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        {files.video ? files.video.name : "Click to upload video file"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="poster">Poster Image (Portrait)</Label>
                            <Input
                                id="poster"
                                type="file"
                                accept="image/*"
                                onChange={e => handleFileChange(e, "poster")}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#141519] border-[#23252b]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle>Featured Movie</CardTitle>
                            <CardDescription>Highlight this movie in the hero carousel.</CardDescription>
                        </div>
                        <Switch
                            checked={isFeatured}
                            onCheckedChange={setIsFeatured}
                        />
                    </CardHeader>
                    {isFeatured && (
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="titleImage">Title Image (Logo/Text Transparent)</Label>
                                <Input
                                    id="titleImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleFileChange(e, "titleImage")}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bannerImage">Banner Image (Landscape Background)</Label>
                                <Input
                                    id="bannerImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleFileChange(e, "bannerImage")}
                                    required
                                />
                            </div>
                        </CardContent>
                    )}
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-[#ff640a] hover:bg-[#e05200] text-white">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? statusMessage : "Create Movie"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
