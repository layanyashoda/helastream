
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About HelaStream',
    description: 'Learn more about HelaStream, your ultimate destination for movies and entertainment.',
};

export default function AboutPage() {
    return (
        <div className="bg-[#141519] text-white min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#141519] via-[#141519]/80 to-transparent z-10"></div>
                {/* Abstract Background or Image - Neutral Movie Theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-[#1e1e1e] opacity-80">
                    {/* Optional: Add a subtle pattern or generic movie collage here if available */}
                </div>

                <div className="relative z-20 container mx-auto px-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
                        We help everyone belong to the <br />
                        <span className="text-[var(--app-background-crunchyroll-orange)]">movie community.</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl">
                        HelaStream connects movie lovers across 200+ countries and territories.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-[#23252b]">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-[var(--app-background-crunchyroll-orange)]">Our Mission</h2>
                        <p className="text-lg text-gray-300 leading-relaxed mb-6">
                            To build the world's best entertainment experience, providing fans with the content they love, when and where they want it.
                        </p>
                        <p className="text-gray-400">
                            We are dedicated to supporting the art of filmmaking, connecting creators with their audience, and fostering a global community of passionate movie buffs.
                        </p>
                    </div>
                    <div className="h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
                        <span className="text-gray-600 font-semibold text-6xl">🎬</span>
                    </div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-20 bg-[#141519]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">What We Do</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">More than just streaming, we create an ecosystem for entertainment fans.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-[#23252b] p-8 rounded-lg hover:translate-y-[-5px] transition-transform duration-300 border border-transparent hover:border-[var(--app-background-crunchyroll-orange)]">
                            <div className="text-[var(--app-background-crunchyroll-orange)] text-4xl mb-6">
                                📺
                            </div>
                            <h3 className="text-xl font-bold mb-3">Streaming</h3>
                            <p className="text-gray-400">
                                Offering a vast library of blockbusters, indie gems, and classics.
                            </p>
                        </div>
                        <div className="bg-[#23252b] p-8 rounded-lg hover:translate-y-[-5px] transition-transform duration-300 border border-transparent hover:border-[var(--app-background-crunchyroll-orange)]">
                            <div className="text-[var(--app-background-crunchyroll-orange)] text-4xl mb-6">
                                📰
                            </div>
                            <h3 className="text-xl font-bold mb-3">News & Reviews</h3>
                            <p className="text-gray-400">
                                Keeping fans updated with the latest news, reviews, and features from the world of cinema.
                            </p>
                        </div>
                        <div className="bg-[#23252b] p-8 rounded-lg hover:translate-y-[-5px] transition-transform duration-300 border border-transparent hover:border-[var(--app-background-crunchyroll-orange)]">
                            <div className="text-[var(--app-background-crunchyroll-orange)] text-4xl mb-6">
                                🤝
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community</h3>
                            <p className="text-gray-400">
                                Connecting millions of fans through social media, events, and interactive experiences.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Global Reach - Stats */}
            <section className="py-20 bg-[var(--app-background-crunchyroll-orange)] text-black">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-black mb-2">120M+</div>
                            <div className="font-bold uppercase tracking-wider text-sm opacity-80">Registered Users</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black mb-2">13M+</div>
                            <div className="font-bold uppercase tracking-wider text-sm opacity-80">Paying Subscribers</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black mb-2">200+</div>
                            <div className="font-bold uppercase tracking-wider text-sm opacity-80">Countries</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black mb-2">46K+</div>
                            <div className="font-bold uppercase tracking-wider text-sm opacity-80">Titles</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Corporate Offices (Simplified) */}
            <section className="py-20 bg-[#23252b]">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Our Global Presence</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['San Francisco', 'Tokyo', 'London', 'Berlin', 'Paris', 'Melbourne', 'Colombo'].map((city) => (
                            <span key={city} className="px-6 py-3 bg-[#141519] rounded-full text-gray-300 border border-gray-700">
                                {city}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
