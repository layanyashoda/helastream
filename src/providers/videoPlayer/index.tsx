"use client";

import {
    ChangeEvent,
    MouseEvent,
    useState,
    useRef,
    useEffect,
    useMemo,
    createContext,
    useContext,
} from "react";
import HLS from "hls.js";
import { useSession } from "next-auth/react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Context, MediaSettingsPanel } from "./index.types";

const VideoPlayerContext = createContext<Context | undefined>(undefined);

export function useVideoPlayer() {
    const context = useContext(VideoPlayerContext);
    if (!context)
        throw new Error("useVideoPlayer must be used within VideoPlayerProvider");

    return context;
}

export function VideoPlayerProvider({
    children,
    media,
    movieId,
}: Readonly<{ children: React.ReactNode; media: string; movieId: string }>) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<HLS | null>(null);
    const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const initlizedPlayerRef = useRef(false);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showControls, setShowControls] = useState(true);

    const [autoPlay, setAutoPlay] = useState(true);
    const [isMediaPlaying, setIsMediaPlaying] = useState(false);
    const [isMediaMute, setIsMediaMute] = useState(false);
    const [volume, setVolume] = useState(1);

    const [isMediaFullscreen, setIsMediaFullscreen] = useState(false);

    const [elapsedTime, setElapsedTime] = useState(0);

    const [seekProgressPercentage, setSeekProgressPercentage] = useState(0);

    const [audioTracks, setAudioTracks] = useState<
        { id: number; name: string }[]
    >([]);
    const [selectedAudioTrack, setSelectedAudioTrack] = useState<number>(0);

    const [subtitleTracks, setSubtitleTracks] = useState<
        { id: number; name: string }[]
    >([]);
    const [selectedSubtitleTrack, setSelectedSubtitleTrack] =
        useState<number>(-1);

    const [qualityLevels, setQualityLevels] = useState<
        { id: number; height: number }[]
    >([]);
    const [selectedQuality, setSelectedQuality] = useState<number>(-1);
    const [currentLevel, setCurrentLevel] = useState(360);

    const [isMediaSettingsPanelOpen, setIsMediaSettingsPanelOpen] =
        useState<MediaSettingsPanel>("off");

    // Check for empty media (Processing state)
    useEffect(() => {
        if (!media) {
            setIsLoading(false);
            setError("Video is processing or unavailable.");
        } else {
            setError(null);
            setIsLoading(true);
        }
    }, [media]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !media) return;

        function play() {
            setIsMediaPlaying(true);
        }

        // ... existing functions ...
        function pause() {
            setIsMediaPlaying(false);
        }
        function waiting() {
            if (!error) setIsLoading(true);
        }
        // ... existing functions ...
        function canPlay() {
            setIsLoading(false);
            if (!initlizedPlayerRef.current) {
                initlizedPlayerRef.current = true;
                hideControls();
            }
        }

        async function tryAutoPlay() {
            if (!video || !autoPlay) return;

            try {
                await video.play();
                setIsMediaPlaying(true);
            } catch (error) {
                console.warn("Autoplay is restricted in this browser.");
                setIsMediaPlaying(false);
            }
        }


        const isHls = media.includes(".m3u8");

        if (HLS.isSupported() && isHls) {
            const hls = new HLS();
            hlsRef.current = hls;

            hls.loadSource(media);
            hls.attachMedia(video);
            hls.nextAutoLevel = -1;

            hls.on(HLS.Events.MANIFEST_PARSED, () => {
                setQualityLevels(
                    hls.levels
                        .map((level, index) => ({
                            id: index,
                            height: level.height,
                        }))
                        .sort((a, b) => b.height - a.height),
                );

                tryAutoPlay();
            });

            hls.on(HLS.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error("HLS Fatal Error:", data);
                    setIsLoading(false);
                    switch (data.type) {
                        case HLS.ErrorTypes.NETWORK_ERROR:
                            setError("Network error: Unable to load video (Check connection or permissions).");
                            hls.startLoad();
                            break;
                        case HLS.ErrorTypes.MEDIA_ERROR:
                            setError("Media error: Video format not supported.");
                            hls.recoverMediaError();
                            break;
                        default:
                            setError("Playback error: Unrecoverable.");
                            hls.destroy();
                            break;
                    }
                }
            });

            // ... audio tracks ...
            hls.on(HLS.Events.AUDIO_TRACKS_UPDATED, () => {
                // ... existing logic ...
                const tracks = hls.audioTracks.map((track, index) => ({
                    id: index,
                    name: track.name,
                }));
                setAudioTracks(tracks);

                const defaultTrack = hls.audioTracks.findIndex(
                    (track) => track.default,
                );
                setSelectedAudioTrack(defaultTrack !== -1 ? defaultTrack : 0);
            });
            // ... subtitle tracks ...
            hls.on(HLS.Events.SUBTITLE_TRACKS_UPDATED, () => {
                // ... existing logic ...
                const tracks = hls.subtitleTracks.map((track, index) => ({
                    id: index,
                    name: track.name,
                }));
                setSubtitleTracks(tracks);

                const defaultTrack = hls.subtitleTracks.findIndex(
                    (track) => track.default,
                );
                setSelectedSubtitleTrack(defaultTrack !== -1 ? defaultTrack : 0);
            });

            hls.on(HLS.Events.LEVEL_SWITCHED, (_, data) => {
                setCurrentLevel(hls.levels[data.level].height);
            });

        } else {
            // Fallback for non-HLS or native support (MP4, etc)
            video.src = media;
            video.addEventListener("loadedmetadata", () => {
                tryAutoPlay();
            });
            video.addEventListener("error", (e) => {
                setIsLoading(false);
                setError("Native playback error.");
                console.error("Native Video Error", e);
            });
        }

        // ... add event listeners ...
        video.addEventListener("play", play);
        video.addEventListener("pause", pause);
        video.addEventListener("waiting", waiting);
        video.addEventListener("canplay", canPlay);
        video.addEventListener("canplaythrough", canPlay);
        video.addEventListener("timeupdate", updateProgress);

        function updateProgress() {
            if (!video) return;
            setElapsedTime(video.currentTime);
            const percentage = (video.currentTime / video.duration) * 100;
            setSeekProgressPercentage(Number.isNaN(percentage) ? 0 : percentage);
        }
        // ... rest of listeners ...

        // ... cleanup ...
        return () => {
            // ... destroy ...
            hlsRef.current?.destroy();
            hlsRef.current = null;
            if (video) {
                video.removeEventListener("play", play);
                video.removeEventListener("pause", pause);
                video.removeEventListener("waiting", waiting);
                video.removeEventListener("canplay", canPlay);
                video.removeEventListener("canplaythrough", canPlay);
                video.removeEventListener("timeupdate", updateProgress);
                // ... remove others ...
            }
        }
    }, [media]);

    // History Tracking
    const { data: session } = useSession();
    const lastSavedTimeRef = useRef<number>(0);

    const saveProgress = async (currentTime: number, duration: number) => {
        if (!session?.user?.id || !movieId) return;

        try {
            const historyRef = doc(db, "users", session.user.id, "history", movieId);
            await setDoc(historyRef, {
                movieId,
                progress: Math.floor(currentTime),
                duration: Math.floor(duration),
                lastWatched: serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.error("Error saving progress:", error);
        }
    };

    useEffect(() => {
        if (!videoRef.current || !movieId || !session?.user?.id) return;
        const video = videoRef.current;

        const onTimeUpdate = () => {
            const now = Date.now();
            if (now - lastSavedTimeRef.current > 10000) { // 10s
                if (video.currentTime > 0) {
                    saveProgress(video.currentTime, video.duration);
                    lastSavedTimeRef.current = now;
                }
            }
        };

        const onPause = () => {
            if (video.currentTime > 0) {
                saveProgress(video.currentTime, video.duration);
            }
        };

        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("pause", onPause);

        return () => {
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.removeEventListener("pause", onPause);
        };
    }, [movieId, session?.user?.id]);

    // Stale State Managment
    const isLoadingRef = useRef(true);
    const isMediaPlayingRef = useRef(false);
    const isMediaSettingsPanelOpenRef = useRef<MediaSettingsPanel>("off");
    useEffect(() => {
        isLoadingRef.current = isLoading;
        isMediaPlayingRef.current = isMediaPlaying;
        isMediaSettingsPanelOpenRef.current = isMediaSettingsPanelOpen;
    }, [isLoading, isMediaPlaying, isMediaSettingsPanelOpen]);

    // Update Que Positions
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const selectedTrack = video.textTracks[selectedSubtitleTrack];
        if (!selectedTrack) return;

        function updateCuePositions() {
            if (!selectedTrack?.cues) return;

            for (const cue of selectedTrack.cues) {
                if (cue instanceof VTTCue) {
                    cue.line = showControls ? -4 : "auto";
                }
            }
        }

        updateCuePositions();

        selectedTrack.addEventListener("cuechange", updateCuePositions);

        return () =>
            selectedTrack.removeEventListener("cuechange", updateCuePositions);
    }, [isMediaFullscreen, showControls, selectedSubtitleTrack]);

    function toggleAutoPlay() {
        setAutoPlay((prev) => !prev);
    }

    function fb10Secs() {
        const video = videoRef.current;
        if (!video) return;

        const newTime = Math.max(video.currentTime - 10, 0);
        video.currentTime = newTime;

        setElapsedTime(newTime);
        setSeekProgressPercentage((newTime / video.duration) * 100);
    }

    async function toggleIsMediaPlaying() {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) await video.play();
        else video.pause();
    }

    function ff10Secs() {
        const video = videoRef.current;
        if (!video) return;

        const newTime = Math.min(video.currentTime + 10, video.duration);
        video.currentTime = newTime;

        setElapsedTime(newTime);
        setSeekProgressPercentage((newTime / video.duration) * 100);
    }

    function seek(e: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLDivElement>) {
        const video = videoRef.current;
        if (!video) return;

        function getSeekPecentage() {
            if ("target" in e && e.target instanceof HTMLInputElement) {
                return Number(e.target.value);
            } else if ("clientX" in e) {
                const rect = (
                    e.currentTarget as HTMLDivElement
                ).getBoundingClientRect();
                return ((e.clientX - rect.left) / rect.width) * 100;
            }

            return 0;
        }

        const percentage = getSeekPecentage();
        setSeekProgressPercentage(percentage);

        const newTime = video.duration ? (percentage / 100) * video.duration : 0;
        video.currentTime = newTime;
        setElapsedTime(newTime);
    }

    function toggleAudio() {
        const video = videoRef.current;
        if (!video) return;

        const isMuted = !video.muted;
        video.muted = isMuted;
        setIsMediaMute(isMuted);

        if (!isMuted && video.volume === 0) {
            changeVolume(1);
        }
    }

    function changeVolume(newVolume: number) {
        const video = videoRef.current;
        if (!video) return;

        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        video.volume = clampedVolume;
        setVolume(clampedVolume);

        if (clampedVolume > 0 && isMediaMute) {
            video.muted = false;
            setIsMediaMute(false);
        } else if (clampedVolume === 0 && !isMediaMute) {
            video.muted = true;
            setIsMediaMute(true);
        }
    }

    function toggleIsMediaFullscreen() {
        const video = videoRef.current;
        if (!video) return;

        if (!document.fullscreenElement) video.requestFullscreen?.();
        else document.exitFullscreen?.();
    }

    function switchAudioTrack(trackId: number) {
        const hls = hlsRef.current;
        if (!hls) return;

        hls.audioTrack = trackId;
        setSelectedAudioTrack(trackId);
        setIsMediaSettingsPanelOpen("off");
    }

    function switchSubtitleTrack(trackId: number) {
        const hls = hlsRef.current;
        if (!hls) return;

        hls.subtitleTrack = trackId;
        setSelectedSubtitleTrack(trackId);
        setIsMediaSettingsPanelOpen("off");
    }

    function switchQualityLevel(qualityLevelId: number) {
        const hls = hlsRef.current;
        if (!hls) return;

        hls.currentLevel = qualityLevelId;
        setSelectedQuality(qualityLevelId);
        setIsMediaSettingsPanelOpen("off");
    }

    function showControlsOnMouseMove() {
        setShowControls(true);
    }

    function hideControls() {
        setShowControls(
            !(
                isMediaPlayingRef.current &&
                isMediaSettingsPanelOpenRef.current === "off"
            ),
        );
    }

    function showControlsOnTouch() {
        setShowControls(true);

        if (hideControlsTimeoutRef.current)
            clearTimeout(hideControlsTimeoutRef.current);

        hideControlsTimeoutRef.current = setTimeout(hideControls, 3000);
    }

    const value = useMemo(
        () => ({
            isLoading,
            autoPlay,
            toggleAutoPlay,
            fb10Secs,
            isMediaPlaying,
            toggleIsMediaPlaying,
            ff10Secs,
            isMediaMute,
            toggleAudio,
            volume,
            changeVolume,
            isMediaFullscreen,
            toggleIsMediaFullscreen,
            elapsedTime,
            seekProgressPercentage,
            seek,
            audioTracks,
            selectedAudioTrack,
            setSelectedAudioTrack,
            subtitleTracks,
            selectedSubtitleTrack,
            setSelectedSubtitleTrack,
            qualityLevels,
            selectedQuality,
            setSelectedQuality,
            currentLevel,
            isMediaSettingsPanelOpen,
            setIsMediaSettingsPanelOpen,
            switchAudioTrack,
            switchSubtitleTrack,
            switchQualityLevel,
        }),
        [
            isLoading,
            autoPlay,
            isMediaPlaying,
            isMediaMute,
            volume,
            isMediaFullscreen,
            elapsedTime,
            seekProgressPercentage,
            audioTracks,
            selectedAudioTrack,
            subtitleTracks,
            selectedSubtitleTrack,
            qualityLevels,
            selectedQuality,
            currentLevel,
            isMediaSettingsPanelOpen,
        ],
    );

    return (
        <VideoPlayerContext.Provider value={value}>
            <div
                role="region"
                onMouseMove={showControlsOnMouseMove}
                onMouseLeave={hideControls}
                onTouchStart={showControlsOnTouch}
                className="video-player relative grid w-full"
                aria-label="video player controls"
            >
                <div className="video-player-sizer pointer-events-none" />

                <div className="relative size-full">
                    <video
                        ref={videoRef}
                        className="video absolute aspect-video size-full"
                        controls={isMediaFullscreen}
                    />

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white z-50">
                            <p className="text-red-500 font-semibold p-4 text-center">{error}</p>
                        </div>
                    )}

                    {!error && (showControls || isLoading) && children}
                </div>
            </div>
        </VideoPlayerContext.Provider>
    );
}
