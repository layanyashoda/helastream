"use client";

import Link from 'next/link';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import images
import ALevel from "@/assets/dataFeed/alevel.jpg";
import Dharmayuddhaya from "@/assets/dataFeed/dharmayuddhaya.jpg";
import Gajaman from "@/assets/dataFeed/gajaman.jpg";
import Giniavi from "@/assets/dataFeed/giniavi.jpg";
import Goal from "@/assets/dataFeed/goal.jpg";
import Heena from "@/assets/dataFeed/heena.jpg";
import Mandara from "@/assets/dataFeed/mandara.jpg";
import Modatharindu from "@/assets/dataFeed/modatharindu.jpg";
import Rankevita from "@/assets/dataFeed/rankevita.jpg";
import Thaala from "@/assets/dataFeed/thaala.jpg";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef(null);
  const heroBgRef = useRef(null);
  const valuePropsRef = useRef(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Hero Entrance
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

    // Hero Parallax
    gsap.to(heroBgRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      y: 200,
      ease: "none"
    });

    // Bento Grid Scroll Reveal
    gsap.from(".bento-item", {
      scrollTrigger: {
        trigger: valuePropsRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out"
    });

    // Infinite Marquee
    // Simple clone for loop effect if not enough items, but with 10 images doubled it might be enough
    if (marqueeRef.current) {
      const marqueeContent = marqueeRef.current;
      const width = marqueeContent.scrollWidth;

      // Clone for seamless loop
      marqueeContent.innerHTML += marqueeContent.innerHTML;

      gsap.to(marqueeContent, {
        x: -width / 2,
        duration: 40, // Slower for better visibility
        ease: "none",
        repeat: -1
      });
    }

  }, { scope: containerRef });

  const trendingImages = [
    ALevel, Dharmayuddhaya, Gajaman, Giniavi, Goal, Heena, Mandara, Modatharindu, Rankevita, Thaala
  ];

  return (
    <div ref={containerRef} className="bg-[#141519] min-h-screen text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background - Parallax */}
        <div ref={heroBgRef} className="absolute inset-0 z-0 opacity-40 scale-110">
          <div className="absolute inset-0 bg-gradient-to-t from-[#141519] via-[#141519]/50 to-black/60 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop"
            alt="Background"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div ref={textRef}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight drop-shadow-2xl">
              ALL YOUR FAVORITE <br />
              <span className="text-[var(--app-background-crunchyroll-orange)]">MOVIES.</span> ONE PLACE.
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 font-medium max-w-2xl mx-auto mt-6 drop-shadow-md">
              Stream the world's largest movie library. Watch offline. No ads. High Definition.
            </p>
          </div>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/discover">
              <Button size="lg" className="bg-[#FF0000] hover:bg-[#c40000] text-white font-bold text-lg px-12 h-16 uppercase tracking-widest rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)]">
                Start Watching
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase animate-pulse">
            14-Day Free Trial available for new members
          </p>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section ref={valuePropsRef} className="py-20 bg-[#141519]">
        <div className="mx-auto px-4 w-full max-w-[95%]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(350px,auto)]">

            {/* 1. Top Wide Item - Header Visual */}
            <div className="bento-item md:col-span-4 relative group overflow-hidden rounded-[2rem] border border-[#23252b] hover:border-[#FF0000]/30 transition-all duration-500 bg-black">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>

              {/* Removed Image */}
              <div className="absolute inset-0 bg-[#0a0a0a] opacity-60"></div>

              {/* Hover Glow */}
              <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#FF0000] rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>

              <div className="relative z-20 h-full flex flex-col justify-end p-10 md:p-14">
                <span className="bg-[#FF0000] text-white text-xs font-bold px-3 py-1.5 rounded-md mb-4 w-fit tracking-wider">PREMIUM</span>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-xl">Experience Cinema at Home</h3>
                <p className="text-gray-300 text-lg max-w-2xl">Ultra High Definition streaming with Dolby Atmos support for the ultimate immersive experience.</p>
              </div>
            </div>

            {/* 2. Large Feature - Infinite Content */}
            <div className="bento-item md:col-span-2 relative group overflow-hidden rounded-[2rem] bg-[#e3dac9] border border-transparent p-10 flex flex-col justify-center min-h-[400px]">
              <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-white rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6 text-[#FF0000] font-bold tracking-wider text-sm uppercase">
                  <span>✨</span> Streaming
                </div>
                <h3 className="text-5xl font-black text-black leading-[0.9] mb-8 tracking-tighter">
                  Dive Into <br /> Infinite Content.
                </h3>
                <Link href="/discover">
                  <Button className="w-fit bg-black text-white hover:bg-gray-800 rounded-full px-10 h-14 text-lg font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl">
                    LEARN MORE
                  </Button>
                </Link>
              </div>
            </div>

            {/* 3. Visual Item - Originals */}
            <div className="bento-item md:col-span-1 relative group overflow-hidden rounded-[2rem] bg-[#1a1c22] border border-[#23252b] min-h-[400px] flex items-center justify-center">
              {/* Removed Image */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              {/* Hover Glow */}
              <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] bg-blue-600 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>

              <div className="absolute bottom-8 left-0 right-0 text-center z-10 transition-transform duration-500 group-hover:-translate-y-2">
                <p className="text-gray-400 text-sm tracking-[0.2em] font-medium uppercase mb-2">Exclusive</p>
                <p className="text-white font-black text-2xl tracking-widest">ORIGINALS</p>
              </div>
            </div>

            {/* 4. Abstract/Feature Item - Offline */}
            <div className="bento-item md:col-span-1 relative group overflow-hidden rounded-[2rem] bg-black border border-[#23252b] min-h-[400px] flex items-center justify-center">
              <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-[#e3dac9] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
              <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] bg-[#FF0000] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

              <div className="relative z-10 text-center transition-transform duration-500 group-hover:scale-110">
                <span className="text-6xl mb-6 block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">🌩️</span>
                <p className="font-bold text-white text-xl">Offline</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Grid of Posters (Decoration) */}
      <section className="pt-0 pb-16 bg-[#141519] overflow-hidden relative">
        <div className="container mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <p className="text-gray-400 mt-2">See what the world is watching</p>
        </div>

        {/* Infinite Marquee */}
        <div className="w-full overflow-hidden whitespace-nowrap mask-gradient relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#141519] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#141519] to-transparent z-10 pointer-events-none"></div>

          <div ref={marqueeRef} className="inline-flex gap-6 pl-4">
            {trendingImages.map((src, i) => (
              <div key={i} className="inline-block w-48 h-72 rounded-lg shrink-0 transform hover:scale-105 transition-transform duration-300 cursor-pointer border border-[#333] hover:border-[#FF0000] overflow-hidden relative">
                <Image
                  src={src}
                  alt={`Trending ${i}`}
                  fill
                  className='object-cover'
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[#141519] relative z-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-gray-800">
              <AccordionTrigger className="text-lg hover:text-[#FF0000]">What is HelaTV+?</AccordionTrigger>
              <AccordionContent className="text-gray-400">
                HelaTV+ is a premium streaming service offering the largest collection of movies and TV shows.
                We focus on high-definition content, offline viewing, and an ad-free experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-gray-800">
              <AccordionTrigger className="text-lg hover:text-[#FF0000]">How much does it cost?</AccordionTrigger>
              <AccordionContent className="text-gray-400">
                We offer flexible plans starting from just $9.99/month. You can cancel anytime.
                Check our Premium page for more details on annual discounts.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-gray-800">
              <AccordionTrigger className="text-lg hover:text-[#FF0000]">Can I watch offline?</AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Yes! All our premium plans include unlimited downloads so you can watch your favorite movies and shows
                on the go, even without an internet connection.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border-gray-800">
              <AccordionTrigger className="text-lg hover:text-[#FF0000]">Is there a free trial?</AccordionTrigger>
              <AccordionContent className="text-gray-400">
                Absolutely. New members get a 14-day free trial to explore the full HelaTV+ library.
                You won't be charged if you cancel before the trial ends.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-t from-black to-[#141519] text-center px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-gray-400">
            Join thousands of members streaming the best content today.
          </p>
          <Link href="/discover">
            <Button size="lg" className="bg-[#FF0000] hover:bg-[#c40000] text-white font-bold text-lg px-12 h-16 uppercase tracking-widest rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,0,0,0.4)]">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
