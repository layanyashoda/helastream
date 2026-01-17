"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

interface GradualBlurProps {
    text: string;
    className?: string;
}

export function GradualBlur({ text, className = "" }: GradualBlurProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const words = text.split(" ");

    useGSAP(() => {
        gsap.fromTo(
            ".blur-word",
            {
                filter: "blur(10px)",
                opacity: 0,
                y: 20,
            },
            {
                filter: "blur(0px)",
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.2,
            }
        );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className={`flex flex-wrap justify-center gap-x-2 ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="blur-word inline-block will-change-[filter,opacity,transform]">
                    {word}
                </span>
            ))}
        </div>
    );
}
