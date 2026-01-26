"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export function ScrollBlur() {
    const blurRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Hide on watch pages
    const isWatchPage = pathname?.startsWith("/watch");

    useEffect(() => {
        const handleScroll = () => {
            if (!blurRef.current) return;

            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const clientHeight = window.innerHeight;

            const distanceToBottom = scrollHeight - scrollTop - clientHeight;
            const threshold = 100; // Start fading out 100px from bottom

            let opacity = 1;
            if (distanceToBottom < threshold) {
                opacity = Math.max(0, distanceToBottom / threshold);
            }

            // Utilize requestAnimationFrame for performance optimization if not using GSAP here, 
            // but direct style set is fast enough for this simple effect.
            blurRef.current.style.opacity = opacity.toString();
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Don't render on watch pages
    if (isWatchPage) {
        return null;
    }

    return (
        <div
            ref={blurRef}
            className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-50 pointer-events-none transition-opacity duration-100 ease-out backdrop-blur-[2px]"
        />
    );
}
