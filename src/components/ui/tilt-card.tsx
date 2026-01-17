"use client";

import { useRef, MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    sensitivity?: number;
}

export function TiltCard({ children, className = "", sensitivity = 15 }: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const xTo = useRef<gsap.QuickToFunc>(null);
    const yTo = useRef<gsap.QuickToFunc>(null);

    useGSAP(() => {
        // @ts-ignore
        xTo.current = gsap.quickTo(contentRef.current, "rotationY", { duration: 0.3, ease: "power2.out" });
        // @ts-ignore
        yTo.current = gsap.quickTo(contentRef.current, "rotationX", { duration: 0.3, ease: "power2.out" });

        // Reset on leave
        const ctx = gsap.context(() => {
            // Cleanup if needed
        }, cardRef);
        return () => ctx.revert();
    }, { scope: cardRef });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!contentRef.current || !xTo.current || !yTo.current) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        xTo.current(xPct * sensitivity);
        yTo.current(-yPct * sensitivity);
    };

    const handleMouseLeave = () => {
        if (!xTo.current || !yTo.current) return;
        xTo.current(0);
        yTo.current(0);
    };

    return (
        <div
            ref={cardRef}
            className={`perspective-1000 ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={contentRef}
                className="transform-style-3d w-full h-full"
            >
                {children}
            </div>
            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
            `}</style>
        </div>
    );
}
