"use client";

import { useEffect, useState } from "react";
import { useSettingsSafe } from "@/providers/settings";

export function PerformanceMetrics() {
    const { settings } = useSettingsSafe();
    const [metrics, setMetrics] = useState({
        pageLoadTime: 0,
        domContentLoaded: 0,
        memoryUsage: 0,
        fps: 0,
    });

    useEffect(() => {
        if (!settings.showPerformanceMetrics) return;

        // Measure page load time
        const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
            setMetrics(prev => ({
                ...prev,
                pageLoadTime: Math.round(navigationEntry.loadEventEnd - navigationEntry.startTime),
                domContentLoaded: Math.round(navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime),
            }));
        }

        // Measure memory (if available)
        const memoryInfo = (performance as any).memory;
        if (memoryInfo) {
            setMetrics(prev => ({
                ...prev,
                memoryUsage: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024),
            }));
        }

        // FPS measurement
        let frameCount = 0;
        let lastTime = performance.now();
        let animationId: number;

        const measureFps = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                setMetrics(prev => ({ ...prev, fps: frameCount }));
                frameCount = 0;
                lastTime = now;
            }
            animationId = requestAnimationFrame(measureFps);
        };

        animationId = requestAnimationFrame(measureFps);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [settings.showPerformanceMetrics]);

    if (!settings.showPerformanceMetrics) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg z-[9999] font-mono backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 mb-2 border-b border-white/20 pb-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <strong>PERFORMANCE</strong>
            </div>
            <div className="space-y-1">
                <div>Page Load: <span className="text-green-400">{metrics.pageLoadTime}ms</span></div>
                <div>DOM Ready: <span className="text-yellow-400">{metrics.domContentLoaded}ms</span></div>
                <div>Memory: <span className="text-blue-400">{metrics.memoryUsage}MB</span></div>
                <div>FPS: <span className={metrics.fps >= 30 ? "text-green-400" : "text-red-400"}>{metrics.fps}</span></div>
            </div>
        </div>
    );
}
