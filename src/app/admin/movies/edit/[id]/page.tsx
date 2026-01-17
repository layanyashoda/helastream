"use client"

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UploadCloud, ArrowLeft } from "lucide-react";
import { Movie } from "@/types";

export default function EditMoviePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
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

    const [isFeatured, setIsFeatured] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        year: new Date().getFullYear(),
        genre: "",
    });

    // Existing URLs to show previews or keep if not updated
    const [existingUrls, setExistingUrls] = useState({
        videoUrl: "",
        posterUrl: "",
        titleImageUrl: "",
        bannerImageUrl: ""
    });

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

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const docRef = doc(db, "videos", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Movie;
                    setFormData({
                        title: data.title || "",
                        description: data.description || "",
                        year: data.year || new Date().getFullYear(),
                        genre: data.genre || "",
                    });
                    setIsFeatured(data.isFeatured || false);
                    setExistingUrls({
                        videoUrl: data.videoUrl || "",
                        posterUrl: data.posterUrl || "",
                        titleImageUrl: data.titleImageUrl || "",
                        bannerImageUrl: data.bannerImageUrl || ""
                    });
                } else {
                    alert("Movie not found");
                    router.push("/admin/movies");
                }
            } catch (error) {
                console.error("Error fetching movie:", error);
                alert("Error fetching movie details");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchMovie();
        }
    }, [id, router]);

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

        // Validation: If no existing poster and no new poster, error
        if (!existingUrls.posterUrl && !files.poster) {
            alert("Poster is required!");
            return;
        }

        if (isFeatured && !existingUrls.titleImageUrl && !files.titleImage) {
            alert("Featured movies require Title Image!");
            return;
        }
        if (isFeatured && !existingUrls.bannerImageUrl && !files.bannerImage) {
            alert("Featured movies require Banner Image!");
            return;
        }

        setIsSaving(true);
        setStatusMessage("Initializing...");

        try {
            const updates: Partial<Movie> = {
                title: formData.title,
                description: formData.description,
                year: Number(formData.year),
                genre: formData.genre,
                isFeatured,
            };

            // 1. Upload Video if changed
            if (files.video) {
                setStatusMessage("Uploading new video file...");
                const videoUrl = await uploadFile(files.video, `videos/${id}`);
                updates.videoUrl = videoUrl;
                updates.filename = files.video.name;
                updates.size = files.video.size;
                // Optionally reset status to Processing if re-uploading triggers transcoding
                updates.status = "Ready";
            }

            // 2. Upload Poster if changed
            if (files.poster) {
                setStatusMessage("Uploading new poster...");
                const posterUrl = await uploadFile(files.poster, "images");
                updates.posterUrl = posterUrl;
                // If no specific thumbnail logic, maybe update thumbnail too? 
                // Currently keeping it simple, assuming thumbnail = poster for fallback
                if (!updates.thumbnailUrl) updates.thumbnailUrl = posterUrl;
            }

            // 3. Upload Featured Assets if changed
            if (files.titleImage) {
                setStatusMessage("Uploading title image...");
                const titleImageUrl = await uploadFile(files.titleImage, "images");
                updates.titleImageUrl = titleImageUrl;
            }
            if (files.bannerImage) {
                setStatusMessage("Uploading banner image...");
                const bannerImageUrl = await uploadFile(files.bannerImage, "images");
                updates.bannerImageUrl = bannerImageUrl;
            }

            // 4. Update Firestore
            setStatusMessage("Updating movie details...");
            const docRef = doc(db, "videos", id);
            await updateDoc(docRef, updates);

            setStatusMessage("Done!");
            router.push("/admin/movies");
            router.refresh();

        } catch (error) {
            console.error("Update failed", error);
            setStatusMessage("Error updating movie.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Edit Movie</h1>
                    <p className="text-muted-foreground">Update movie details and assets.</p>
                </div>
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
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
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
                                <Select value={formData.genre} onValueChange={(v) => setFormData({ ...formData, genre: v })}>
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
                        <CardDescription>Update video file and posters. Leave empty to keep existing.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="video">Video File (MP4)</Label>
                            {existingUrls.videoUrl && (
                                <p className="text-sm text-green-500 mb-2">✓ Current Video Exists</p>
                            )}
                            <div className="border-2 border-dashed border-[#23252b] rounded-lg p-6 hover:bg-[#23252b]/50 transition-colors cursor-pointer relative">
                                <Input
                                    id="video"
                                    type="file"
                                    accept="video/mp4,video/webm"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={e => handleFileChange(e, "video")}
                                />
                                <div className="text-center">
                                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        {files.video ? files.video.name : "Click to replace video file"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="poster">Poster Image</Label>
                            {existingUrls.posterUrl && (
                                <div className="mb-2">
                                    <img src={existingUrls.posterUrl} alt="Current Poster" className="h-32 object-cover rounded" />
                                </div>
                            )}
                            <Input
                                id="poster"
                                type="file"
                                accept="image/*"
                                onChange={e => handleFileChange(e, "poster")}
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
                                <Label htmlFor="titleImage">Title Image</Label>
                                {existingUrls.titleImageUrl && (
                                    <div className="mb-2 bg-black/50 p-2 rounded w-fit">
                                        <img src={existingUrls.titleImageUrl} alt="Current Title" className="h-10 object-contain" />
                                    </div>
                                )}
                                <Input
                                    id="titleImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleFileChange(e, "titleImage")}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bannerImage">Banner Image</Label>
                                {existingUrls.bannerImageUrl && (
                                    <div className="mb-2">
                                        <img src={existingUrls.bannerImageUrl} alt="Current Banner" className="h-20 w-full object-cover rounded" />
                                    </div>
                                )}
                                <Input
                                    id="bannerImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleFileChange(e, "bannerImage")}
                                />
                            </div>
                        </CardContent>
                    )}
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving} className="bg-[#ff640a] hover:bg-[#e05200] text-white">
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSaving ? statusMessage : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
