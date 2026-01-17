"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

export function UploadVideoDialog() {
    const [file, setFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setProgress(0);

        try {
            // 1. Create Storage Reference
            // Use timestamp to avoid name collisions
            const filename = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `videos/${filename}`);

            // 2. Start Upload
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(p);
                },
                (error) => {
                    console.error("Upload error:", error);
                    setUploading(false);
                    alert("Upload failed!");
                },
                async () => {
                    // 3. Upload Complete
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // 4. Save Metadata to API (Firestore)
                    await fetch("/api/videos", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            filename: file.name,
                            streamingUrl: downloadURL,
                            size: file.size,
                            status: "Ready", // Direct upload is ready (raw)
                        }),
                    });

                    setUploading(false);
                    setOpen(false);
                    setFile(null);
                    router.refresh(); // Refresh list
                }
            );

        } catch (error) {
            console.error("Error starting upload:", error);
            setUploading(false);
            alert("Error starting upload");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#ff640a] hover:bg-[#ff7b2e] text-white">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#141519] border-[#23252b] text-white">
                <DialogHeader>
                    <DialogTitle>Upload Video</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Select a video file to upload directly to Firebase Storage.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="video" className="text-right text-gray-300">
                            Video File
                        </Label>
                        <Input
                            id="video"
                            type="file"
                            accept="video/mp4"
                            onChange={handleFileChange}
                            className="col-span-3 bg-[#23252b] border-[#34363e] text-white file:text-white"
                        />
                    </div>
                    {uploading && (
                        <div className="col-span-4 space-y-2">
                            <div className="h-2 w-full bg-[#23252b] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#ff640a] transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-center text-gray-400">{Math.round(progress)}% Uploaded</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-[#ff640a] hover:bg-[#ff7b2e] text-white disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            "Upload"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
