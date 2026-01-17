"use client"
import { useEffect, useRef } from "react"
import videojs from "video.js"
import "video.js/dist/video-js.css"
import type Player from "video.js/dist/types/player"

interface VideoPlayerProps {
    src: string
    type?: string
}

export function VideoPlayer({ src, type = "application/x-mpegURL" }: VideoPlayerProps) {
    const videoNode = useRef<HTMLVideoElement>(null)
    const player = useRef<Player | null>(null)

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
        } else {
            // Update player source
            const currentSrc = player.current.src()
            if (currentSrc !== src) {
                player.current.src({ src, type })
            }
        }

        return () => {
            if (player.current) {
                player.current.dispose()
                player.current = null
            }
        }
    }, [src, type])

    return (
        <div data-vjs-player>
            <video ref={videoNode} className="video-js vjs-big-play-centered" />
        </div>
    )
}
