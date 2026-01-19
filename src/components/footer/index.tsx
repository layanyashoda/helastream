import Link from "next/link";
import { HeaderLogoLarge } from "@/assets/headerLogo";
import {
    FaYoutube,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaTiktok,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="w-full bg-black text-[#a0a0a0] pt-12 pb-6 text-[0.75rem] font-medium leading-[1.35]">
            <div className="container-cmp mx-auto px-5">
                {/* Navigation Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 mb-12">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-white text-base font-bold mb-2">Navigation</h3>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Browse Popular</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Browse Simulcasts</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Browse Manga</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Release Calendar</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">News</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Gmes</Link>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-white text-base font-bold mb-2">Connect</h3>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Youtube</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Facebook</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">X (Twitter)</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Instagram</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">TikTok</Link>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-white text-base font-bold mb-2">HelaTV+</h3>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">About</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Help/FAQ</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Terms of Use</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">AdChoices</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Cookie Consent Tool</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Press Inquiries</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Get the Apps</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Redeem Gift Card</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Jobs</Link>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-white text-base font-bold mb-2">Account</h3>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Create Account</Link>
                        <Link href="#" className="hover:text-white hover:underline transition-colors">Log In</Link>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#23252b] mb-6"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Social & Language */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors"><FaYoutube size={24} /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><FaFacebookF size={24} /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><FaTwitter size={24} /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><FaInstagram size={24} /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><FaTiktok size={24} /></Link>
                        </div>
                    </div>

                    {/* Logo & Copyright */}
                    <div className="flex flex-col items-center md:items-end gap-1 text-center md:text-right">
                        <div className="transform scale-75 origin-right">
                            <HeaderLogoLarge />
                        </div>
                        <p>&copy; HelaTV+, LLC</p>
                        <div className="flex gap-2 text-xs">
                            <span>Sony Pictures</span>
                            <span>|</span>
                            <span>Entertainment</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
