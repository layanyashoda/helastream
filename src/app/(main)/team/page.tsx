
import { Metadata } from 'next';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

export const metadata: Metadata = {
    title: 'Our Team - HelaStream',
    description: 'Meet the passionate team behind HelaStream.',
};

const TEAM_MEMBERS = [
    {
        name: "Alex Sterling",
        role: "Founder & CEO",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", // Placeholder Avatar
        bio: "Visionary leader with a passion for bringing global entertainment to local audiences.",
        social: { linkedin: "#", twitter: "#" }
    },
    {
        name: "Sarah Chen",
        role: "Chief Technology Officer",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        bio: "Tech veteran ensuring our streaming infrastructure is world-class and buffer-free.",
        social: { linkedin: "#", github: "#" }
    },
    {
        name: "Marcus Johnson",
        role: "Head of Content",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        bio: "Curating the best library of movies and shows for our diverse community.",
        social: { linkedin: "#", twitter: "#" }
    },
    {
        name: "Emily Davis",
        role: "Lead Designer",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        bio: "Crafting intuitive and beautiful user experiences across all platforms.",
        social: { linkedin: "#", twitter: "#" }
    },
    {
        name: "David Silva",
        role: "Community Manager",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        bio: "Building bridges between fans and the content they love through engagement.",
        social: { linkedin: "#", twitter: "#" }
    }
];

export default function TeamPage() {
    return (
        <div className="bg-[#141519] text-white min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Meet the <span className="text-[var(--app-background-crunchyroll-orange)]">Team</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        The passionate individuals working behind the scenes to bring you the ultimate entertainment experience.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 justify-items-center">
                    {TEAM_MEMBERS.map((member, index) => (
                        <div
                            key={index}
                            className={`bg-[#23252b] rounded-lg overflow-hidden border border-gray-800 hover:border-[var(--app-background-crunchyroll-orange)] transition-all duration-300 w-full max-w-sm group lg:col-span-2 ${index === 3 ? 'lg:col-start-2' : ''}`}
                        >
                            {/* Image Container */}
                            <div className="h-64 bg-gray-800 relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-gray-700 to-[#23252b]">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="size-48 rounded-full border-4 border-[#141519] shadow-lg group-hover:scale-105 transition-transform duration-300 bg-[#141519]"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                                <p className="text-[var(--app-background-crunchyroll-orange)] font-medium mb-4">{member.role}</p>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                    {member.bio}
                                </p>

                                {/* Social Links */}
                                <div className="flex justify-center gap-4">
                                    {member.social.linkedin && (
                                        <a href={member.social.linkedin} className="text-gray-500 hover:text-white transition-colors">
                                            <FaLinkedin size={20} />
                                        </a>
                                    )}
                                    {member.social.twitter && (
                                        <a href={member.social.twitter} className="text-gray-500 hover:text-white transition-colors">
                                            <FaTwitter size={20} />
                                        </a>
                                    )}
                                    {/* @ts-ignore */}
                                    {member.social.github && (
                                        <a href={member.social.github} className="text-gray-500 hover:text-white transition-colors">
                                            <FaGithub size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
