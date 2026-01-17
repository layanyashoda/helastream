"use client";

import Link from 'next/link';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(textRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 2.3 // Wait for preloader
    })
      .from(buttonsRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8
      }, "-=0.5");

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#141519] min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background - Use a collage of movie posters or a featured dark graphic */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-t from-[#141519] via-transparent to-black/60"></div>
          <img
            src="https://wallpapers.com/images/hd/anime-collage-1920-x-1080-wallpaper-f23635s75b5k93d3.jpg"
            alt="Background"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div ref={textRef}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight">
              ALL YOUR FAVORITE <br />
              <span className="text-[var(--app-background-crunchyroll-orange)]">MOVIES.</span> ONE PLACE.
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 font-medium max-w-2xl mx-auto mt-6">
              Stream the world's largest movie library. Watch offline. No ads. High Definition.
            </p>
          </div>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/discover">
              <button className="bg-[var(--app-background-crunchyroll-orange)] hover:bg-[#ff3333] text-black font-bold text-lg px-10 py-4 uppercase tracking-widest clip-path-polygon transition-transform hover:scale-105 active:scale-95">
                Start Watching Free
              </button>
            </Link>
            <Link href="/premium">
              <button className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold text-lg px-10 py-4 uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                Go Premium
              </button>
            </Link>
          </div>

          <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase animate-pulse">
            14-Day Free Trial available for new members
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-[#000000]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4 p-6 rounded-xl hover:bg-[#23252b] transition-colors duration-300">
              <div className="text-[var(--app-background-crunchyroll-orange)] text-5xl mb-6">📺</div>
              <h3 className="text-2xl font-bold">Watch Everywhere</h3>
              <p className="text-gray-400 text-lg">Stream on your phone, tablet, laptop, and TV without skipping a beat.</p>
            </div>
            <div className="space-y-4 p-6 rounded-xl hover:bg-[#23252b] transition-colors duration-300">
              <div className="text-[var(--app-background-crunchyroll-orange)] text-5xl mb-6">🌩️</div>
              <h3 className="text-2xl font-bold">Offline Viewing</h3>
              <p className="text-gray-400 text-lg">Download your favorites and watch them on the go, even without internet.</p>
            </div>
            <div className="space-y-4 p-6 rounded-xl hover:bg-[#23252b] transition-colors duration-300">
              <div className="text-[var(--app-background-crunchyroll-orange)] text-5xl mb-6">🚫</div>
              <h3 className="text-2xl font-bold">Ad-Free Experience</h3>
              <p className="text-gray-400 text-lg">Enjoy non-stop entertainment with absolutely no interruptions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Posters (Decoration) */}
      <section className="py-20 bg-[#141519] overflow-hidden">
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold">Trending Now</h2>
        </div>
        {/* Simple Marquee effect or static grid */}
        <div className="flex justify-center gap-4 opacity-70">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-48 h-72 bg-gray-800 rounded-md animate-pulse"></div>
          ))}
        </div>
      </section>

    </div>
  );
}
