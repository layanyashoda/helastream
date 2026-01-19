"use client"
import { useEffect, useRef } from "react"
import videojs from "video.js"
import "video.js/dist/video-js.css"
import type Player from "video.js/dist/types/player"

import { useSession } from "next-auth/react"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface VideoPlayerProps {
    src: string
    type?: string
}

export function VideoPlayer({ src, type = "application/x-mpegURL", movieId }: VideoPlayerProps & { movieId?: string }) {
    const videoNode = useRef<HTMLVideoElement>(null)
    const player = useRef<Player | null>(null)
    const { data: session } = useSession()
    const lastSavedTime = useRef<number>(0)

    const saveProgress = async (currentTime: number, duration: number) => {
        if (!session?.user?.id || !movieId) return

        try {
            const historyRef = doc(db, "users", session.user.id, "history", movieId)
            await setDoc(historyRef, {
                movieId,
                progress: Math.floor(currentTime),
                duration: Math.floor(duration),
                lastWatched: serverTimestamp(),
            }, { merge: true })
        } catch (error) {
            console.error("Error saving progress:", error)
        }
    }

    useEffect(() => {
        if (!videoNode.current) return

        if (!player.current) {
            // Initialize player
            player.current = videojs(videoNode.current, {
                controls: true,
                fluid: true,
                sources: [{
                    src,
                    type
                }]
            })

            // Add event listeners
            player.current.on('timeupdate', () => {
                const now = Date.now()
                if (now - lastSavedTime.current > 10000) { // Save every 10s
                    const currentTime = player.current?.currentTime() || 0
                    const duration = player.current?.duration() || 0
                    if (currentTime > 0) {
                        saveProgress(currentTime, duration)
                        lastSavedTime.current = now
                    }
                }
            })

            player.current.on('pause', () => {
                const currentTime = player.current?.currentTime() || 0
                const duration = player.current?.duration() || 0
                if (currentTime > 0) {
                    saveProgress(currentTime, duration)
                }
            })

        } else {
            // Update player source
            const currentSrc = (player.current as any).src()
            if (currentSrc !== src) {
                player.current.src({ src, type })
            }
        }

        return () => {
            if (player.current) {
                // Save one last time on unmount
                const currentTime = player.current.currentTime() || 0
                const duration = player.current.duration() || 0
                if (currentTime > 0 && session?.user?.id && movieId) {
                    // We can't await here effectively, but we try fire-and-forget
                    // Note: fetch/sendBeacon is better for unmount, but this is a simple attempt
                    const historyRef = doc(db, "users", session.user.id, "history", movieId)
                    setDoc(historyRef, {
                        movieId,
                        progress: Math.floor(currentTime),
                        duration: Math.floor(duration),
                        lastWatched: serverTimestamp(),
                    }, { merge: true }).catch(err => console.error(err))
                }

                player.current.dispose()
                player.current = null
            }
        }
    }, [src, type, movieId, session?.user?.id])

    return (
        <div data-vjs-player>
            <video ref={videoNode} className="video-js vjs-big-play-centered" />
        </div>
    )
}
