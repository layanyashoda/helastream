"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BlockBlobClient } from "@azure/storage-blob"
import { Loader2 } from "lucide-react"

export function UploadDialog() {
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        try {
            // 1. Get SAS Token
            const response = await fetch("/api/upload/sas", {
                method: "POST",
                body: JSON.stringify({ filename: file.name }),
            })

            if (!response.ok) throw new Error("Failed to get SAS token")

            const { sasToken, url, blobName } = await response.json()

            // 2. Upload to Azure Blob Storage
            // Construct the full URL with SAS token for the client
            // The API returns 'url' which is containerUrl/blobName?sasToken
            const blobClient = new BlockBlobClient(url)

            await blobClient.uploadData(file, {
                blobHTTPHeaders: { blobContentType: file.type },
                onProgress: (progress) => {
                    console.log(`Uploaded ${progress.loadedBytes} bytes`)
                }
            })

            // 3. (Optional) Save metadata to DB
            // await saveVideoMetadata({ filename: file.name, blobName })

            console.log("Upload successful!")
            setIsOpen(false)
            setFile(null)
            // Ideally trigger a refresh of the video list here
        } catch (error) {
            console.error("Upload failed", error)
            alert("Upload failed!")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Upload Video</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Video</DialogTitle>
                    <DialogDescription>
                        Select a video file to upload. It will be processed for streaming.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="video" className="text-right">
                            Video
                        </Label>
                        <Input
                            id="video"
                            type="file"
                            accept="video/*"
                            className="col-span-3"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleUpload} disabled={!file || isUploading}>
                        {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
