"use client";

import Image from "next/image";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    RotateCcw,
    RotateCw,
} from "lucide-react";

import { useVideoPlayer } from "@/providers/videoPlayer";
import { timeToFormattedTime } from "@/lib/utils";

import SettingsPanel from "./settingsPanel";

import { Loader } from "@/assets/icons";

import "./index.css";

const VideoPlayer: React.FC<{ duration: number }> = ({ duration }) => {
    const {
        isLoading,
        elapsedTime,
        toggleAudio,
        isMediaMute,
        fb10Secs,
        toggleIsMediaFullscreen,
        ff10Secs,
        isMediaFullscreen,
        toggleIsMediaPlaying,
        isMediaPlaying,
        seek,
        seekProgressPercentage,
        volume,
        changeVolume,
    } = useVideoPlayer();

    const formattedElapsedTime = timeToFormattedTime(elapsedTime);
    const formattedTotalDuration = timeToFormattedTime(duration);

    return (
        <div className="controls absolute inset-0 bg-transparent group select-none">
            <div className="relative size-full flex flex-col justify-end">
                {/* Center Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-6 pointer-events-auto">
                        {isLoading ? (
                            <Loader className="size-12 animate-spin text-white" />
                        ) : (
                            <>
                                <button
                                    onClick={fb10Secs}
                                    className="group/btn relative flex size-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-105 active:scale-95"
                                >
                                    <RotateCcw className="size-5 fill-white/20" />
                                    <span className="absolute text-[10px] font-bold mt-0.5">10</span>
                                </button>

                                <button
                                    onClick={toggleIsMediaPlaying}
                                    className="flex size-16 items-center justify-center rounded-full bg-white text-black shadow-lg transition-all hover:scale-105 active:scale-95"
                                >
                                    {isMediaPlaying ? (
                                        <Pause className="size-8 fill-black" />
                                    ) : (
                                        <Play className="size-8 fill-black ml-1" />
                                    )}
                                </button>

                                <button
                                    onClick={ff10Secs}
                                    className="group/btn relative flex size-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:scale-105 active:scale-95"
                                >
                                    <RotateCw className="size-5 fill-white/20" />
                                    <span className="absolute text-[10px] font-bold mt-0.5">10</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom Control Bar */}
                <div className="relative z-10 w-full px-4 pb-4 pt-16 transition-opacity duration-300 focus-within:opacity-100">
                    {/* Seek Bar */}
                    <div
                        className="group/seek relative mb-4 flex h-4 cursor-pointer items-center touch-none"
                        onClick={seek}
                    >
                        {/* Track Background */}
                        <div className="absolute h-1 w-full rounded-full bg-white/20 group-hover/seek:h-1.5 transition-all" />

                        {/* Progress */}
                        <div
                            className="absolute h-1 rounded-full bg-[var(--app-background-crunchyroll-orange)] group-hover/seek:h-1.5 transition-all"
                            style={{ width: `${seekProgressPercentage}%` }}
                        />

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={seekProgressPercentage}
                            onChange={seek}
                            className="seek relative z-10 w-full opacity-0 cursor-pointer"
                        />

                        {/* Thumb */}
                        <div
                            className="absolute size-3 rounded-full bg-white shadow-lg pointer-events-none transition-transform scale-0 group-hover/seek:scale-100"
                            style={{ left: `${seekProgressPercentage}%`, transform: `translateX(-50%) ${seekProgressPercentage > 0 ? 'scale(1)' : 'scale(0)'}` }}
                        />
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleIsMediaPlaying}
                                className="text-white/90 hover:text-white transition-colors hover:scale-110 active:scale-95"
                            >
                                {isMediaPlaying ? (
                                    <Pause className="size-6 fill-white" />
                                ) : (
                                    <Play className="size-6 fill-white" />
                                )}
                            </button>

                            <div className="group/vol flex items-center gap-2">
                                <button
                                    onClick={toggleAudio}
                                    className="text-white/90 hover:text-white transition-colors hover:scale-110 active:scale-95"
                                >
                                    {isMediaMute || volume === 0 ? (
                                        <VolumeX className="size-6" />
                                    ) : (
                                        <Volume2 className="size-6" />
                                    )}
                                </button>

                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMediaMute ? 0 : volume}
                                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                                    className="w-20 transition-all origin-left mb-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                            </div>

                            <div className="text-sm font-medium text-white/90 tabular-nums tracking-wide">
                                <span>{formattedElapsedTime}</span>
                                <span className="mx-2 text-white/40">/</span>
                                <span>{formattedTotalDuration}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <SettingsPanel />

                            <button
                                onClick={toggleIsMediaFullscreen}
                                className="text-white/90 hover:text-white transition-colors hover:scale-110 active:scale-95"
                            >
                                {isMediaFullscreen ? (
                                    <Minimize className="size-6" />
                                ) : (
                                    <Maximize className="size-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
