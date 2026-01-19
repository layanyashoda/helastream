"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { GradualBlur } from "@/components/ui/gradual-blur";
import { TiltCard } from "@/components/ui/tilt-card";

gsap.registerPlugin(ScrollTrigger);

import img06 from "@/assets/members/06.jpeg";
import img29 from "@/assets/members/29.jpeg";
import img73 from "@/assets/members/73.jpeg";
import img74 from "@/assets/members/74.jpeg";
import img81 from "@/assets/members/81.jpeg";
import headerBg from "@/assets/misc/4.jpg";
import Image from "next/image";

const TEAM_MEMBERS = [
    {
        name: "Chanuka Isuru",
        number: "06",
        role: "Backend Developer",
        image: img06.src,
        social: { linkedin: "https://www.linkedin.com/in/chanuka-isuru-5030492b2/", github: "https://github.com/Chanukaisuru" }
    },
    {
        name: "Chamika Lakshan",
        number: "29",
        role: "Cloud Engineer",
        image: img29.src,
        social: { linkedin: "https://www.linkedin.com/in/chamikalakshan/", github: "https://github.com/chamika2001" }
    },
    {
        name: "Nethmi Pahasarani",
        number: "73",
        role: "UI/UX Designer",
        image: img73.src,
        social: { linkedin: "https://www.linkedin.com/in/nethmipahasarani/", github: "https://github.com/pahasarani" }
    },
    {
        name: "Sanduni Bodhika",
        number: "74",
        role: "System Engineer",
        image: img74.src,
        social: { linkedin: "https://www.linkedin.com/in/bodhikadisanayaka/", github: "https://github.com/Bodhiii-74" }
    },
    {
        name: "Layan Yasoda",
        number: "81",
        role: "Frontend Developer",
        image: img81.src,
        social: { linkedin: "https://www.linkedin.com/in/layanyasoda/", github: "https://github.com/layanyashoda" }
    }
];

export default function TeamPage() {
    const containerRef = useRef(null);

    useGSAP(() => {
        // Hero Parallax
        gsap.to(".hero-bg-img", {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Team Grid Animation - Staggered Reveal
        const cards = gsap.utils.toArray(".team-card-container");
        cards.forEach((card: any, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                delay: i * 0.1 // Simple staggered delay based on index
            });
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden selection:bg-red-500/30">

            {/* 1. Cinematic Hero */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 hero-bg-img should-animate">
                    <Image
                        src={headerBg}
                        alt="Office Background"
                        fill
                        className="object-cover opacity-20 scale-110 grayscale"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/60 to-[#0a0a0a]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%)]"></div>
                </div>

                <div className="relative z-10 text-center container px-6 mt-10">
                    <div className="inline-block mb-4 overflow-hidden">
                        <span className="text-[#FF0000] font-mono text-sm tracking-[0.2em] uppercase">The Visionaries</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 relative">
                        <GradualBlur text="MEET THE SQUAD" className="justify-center" />
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        The minds crafting the next generation of entertainment.
                    </p>
                </div>
            </section>

            {/* 2. The Team Grid (Immersive Cards) */}
            <section className="pb-32 bg-[#0a0a0a] team-section relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#23252b] to-transparent"></div>

                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                        {TEAM_MEMBERS.map((member, idx) => (
                            <TiltCard
                                key={idx}
                                className={`team-card-container group ${idx === 4
                                    ? 'md:col-span-2 lg:col-span-6 lg:col-start-4'
                                    : 'lg:col-span-6'
                                    }`}
                                sensitivity={10}
                            >
                                <div className="relative h-[450px] w-full rounded-[2rem] overflow-hidden transition-all duration-700 ease-out group-hover:shadow-[0_0_50px_-12px_rgba(255,0,0,0.25)] border border-white/5 group-hover:border-white/10 bg-[#141519] translate-z-0">

                                    {/* Image with overlay */}
                                    <div className="absolute inset-0 w-full h-full">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale-[0.3] group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90"></div>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                                    </div>

                                    {/* Content - Bottom Aligned */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 translate-z-10">
                                        <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                                            <div>
                                                <div className="text-[#FF0000] font-mono text-sm font-bold tracking-widest mb-2 uppercase">
                                                    {member.role}
                                                </div>
                                                <h3 className="text-3xl font-bold text-white leading-none whitespace-pre-wrap">
                                                    {member.name.split(" ").map((n, i) => (
                                                        <span key={i} className="block">{n}</span>
                                                    ))}
                                                </h3>
                                            </div>
                                            <span className="text-7xl font-black text-white/20 absolute top-8 right-8 group-hover:text-white/40 transition-colors duration-500 select-none transform translate-z-20">
                                                {member.number}
                                            </span>
                                        </div>

                                        {/* Social Links - Reveal on Hover */}
                                        <div className="flex items-center gap-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                            <span className="text-sm text-gray-400 font-medium">Connect:</span>
                                            <div className="flex gap-4">
                                                {member.social.linkedin && (
                                                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#FF0000] transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"><FaLinkedin size={18} /></a>
                                                )}
                                                {member.social.github && (
                                                    <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#FF0000] transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"><FaGithub size={18} /></a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Join Us CTA (Minimal & Bold) */}
            <section className="py-32 bg-[#0a0a0a] border-t border-white/5 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1c22_0%,transparent_70%)] opacity-50"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                        SHAPE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] to-orange-600">UNSEEN</span>
                    </h2>
                    <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto font-light">
                        We are looking for the outliers, the obsession-driven, and the dreamers.
                    </p>
                    <Link href="#">
                        <Button className="bg-[#FF0000] text-white hover:bg-[#cc0000] font-bold text-lg px-12 h-16 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(255,0,0,0.4)]">
                            See Open Positions
                        </Button>
                    </Link>
                </div>
            </section>

        </div>
    );
}
