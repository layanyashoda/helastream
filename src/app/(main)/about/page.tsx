"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import headerBg from "@/assets/misc/5.jpg";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
    const containerRef = useRef(null);
    const heroTextRef = useRef(null);
    const heroBgRef = useRef(null);

    useGSAP(() => {
        // Hero Parallax
        gsap.to(heroBgRef.current, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Hero Fade-in
        gsap.from(heroTextRef.current, {
            y: 50,
            opacity: 0,
            duration: 1.2,
            delay: 0.2,
            ease: "power3.out"
        });

        // Stats Reveal
        gsap.from(".stat-item", {
            scrollTrigger: {
                trigger: ".stats-grid",
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });

        // Values Reveal
        gsap.from(".value-card", {
            scrollTrigger: {
                trigger: ".values-section",
                start: "top 75%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="bg-[#141519] text-white min-h-screen">

            {/* 1. Cinematic Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div ref={heroBgRef} className="absolute inset-0 z-0 scale-110">
                    <Image
                        src={headerBg}
                        alt="Cinema Background"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141519] via-[#141519]/40 to-black/60"></div>
                </div>

                <div ref={heroTextRef} className="relative z-10 container mx-auto px-6 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-[#FF0000]/20 text-[#FF0000] border border-[#FF0000]/30 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter drop-shadow-2xl">
                        THE FUTURE OF <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] to-orange-500">SRI LANKAN</span> STREAMING
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                        We are building the ultimate entertainment ecosystem. Premium content, zero interruptions, and a community that celebrates the art of storytelling.
                    </p>
                </div>
            </section>

            {/* 2. Mission Statement */}
            <section className="py-24 bg-[#141519] border-t border-white/5">
                <div className="container mx-auto px-6 max-w-5xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-12">
                        "We believe that great stories deserve a great platform. <span className="text-gray-500">HelaTV+ is built for the obsessed, the bingers, and the true fans of cinema.</span>"
                    </h2>
                </div>
            </section>

            {/* 3. Stats / Bento Grid */}
            <section className="py-20 bg-black stats-grid">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(250px,auto)]">

                        {/* Users Stat - Large */}
                        <div className="stat-item md:col-span-2 md:row-span-2 bg-[#1a1c22] rounded-[2rem] p-10 flex flex-col justify-between border border-[#23252b] hover:border-[#FF0000]/50 transition-colors group">
                            <div className="w-16 h-16 rounded-full bg-[#FF0000]/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">👥</div>
                            <div>
                                <h3 className="text-6xl md:text-8xl font-black text-white mb-2 tracking-tighter">10,000+</h3>
                                <p className="text-xl text-gray-400 font-medium">Registered Users</p>
                            </div>
                        </div>

                        {/* Libraries Stat */}
                        <div className="stat-item md:col-span-2 bg-[#e3dac9] text-black rounded-[2rem] p-10 flex flex-col justify-center border border-transparent">
                            <h3 className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">1,000+</h3>
                            <p className="text-lg font-bold uppercase tracking-wider opacity-80">Movies</p>
                        </div>

                        {/* Countries Stat */}
                        <div className="stat-item md:col-span-1 bg-[#1a1c22] rounded-[2rem] p-8 flex flex-col justify-center border border-[#23252b]">
                            <h3 className="text-4xl font-black text-[#FF0000] mb-1">100+</h3>
                            <p className="text-sm text-gray-400 font-medium">TV Series</p>
                        </div>

                        {/* 4K Content Stat */}
                        <div className="stat-item md:col-span-1 bg-gradient-to-br from-[#FF0000] to-orange-600 rounded-[2rem] p-8 flex flex-col justify-center text-white">
                            <h3 className="text-4xl font-black mb-1">4K HDR</h3>
                            <p className="text-sm text-white/90 font-medium">Ultra High Definition</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. Our Values */}
            <section className="py-24 bg-[#141519] values-section">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Why We Do It</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Our core principles that drive every decision we make.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: "⚡", title: "Speed & Quality", desc: "Streaming that starts instantly and never buffers. We invest in the best infrastructure." },
                            { icon: "🎨", title: "Creator First", desc: "We support filmmakers by providing a platform that respects their vision and art." },
                            { icon: "🌍", title: "Community", desc: "Building a global home for fans to connect, discuss, and celebrate their favorite content." }
                        ].map((item, idx) => (
                            <Card key={idx} className="value-card bg-[#1a1c22] border-[#23252b] text-white hover:bg-[#202229] transition-colors duration-300">
                                <CardContent className="p-8">
                                    <div className="text-5xl mb-6">{item.icon}</div>
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Team CTA */}
            <section className="py-24 bg-black relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/10 to-transparent pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black mb-8">Meet the Minds Behind HelaTV+</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        A passionate team of engineers, designers, and cinephiles working together to redefine entertainment.
                    </p>
                    <Link href="/team">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-bold text-lg px-10 h-14 rounded-full transition-all hover:scale-105 active:scale-95">
                            View Our Team
                        </Button>
                    </Link>
                </div>
            </section>

        </div>
    );
}
