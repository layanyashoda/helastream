"use client";

import { useState, KeyboardEvent, MouseEvent } from "react";
import Link from "next/link";
import { User } from "next-auth";

import useBodyOverflow from "@/hooks/useBodyOverflow";
import { triggerCallbackOnClickOrOnKeydown } from "@/lib/utils";

import HeaderMenu from "./headerMenu";

import { HeaderState } from "./types";

import { HiSearch, HiOutlineUser, HiOutlineBookmark, HiOutlineLogin, HiOutlineClock } from "react-icons/hi";
import { LogOut, LayoutDashboard } from "lucide-react";

import { HeaderLogoMobileOnly, HeaderLogoLarge } from "@/assets/headerLogo";
import "./index.css";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
    user?: User;
}

const Header = ({ user }: HeaderProps) => {
    const [headerState, setHeaderState] = useState<HeaderState>("close");

    useBodyOverflow(headerState !== "close");

    function closeHeader(e: KeyboardEvent | MouseEvent) {
        triggerCallbackOnClickOrOnKeydown(e, () => setHeaderState("close"));
    }

    return (
        <header>
            <div className="container-cmp header-container has-no-gutters">
                <div title="Company Logo" className="header-logo">
                    <Link href="/" prefetch={false} className="group block size-full px-4.5">
                        <HeaderLogoMobileOnly className="sm:hidden" />
                        <HeaderLogoLarge className="hidden sm:block" />
                    </Link>
                </div>

                {user ? (
                    <>
                        <div title="Menu" className="header-menu">
                            <HeaderMenu
                                headerState={headerState}
                                setHeaderState={setHeaderState}
                            />
                        </div>

                        <div className="header-actions">
                            <ul className="flex items-center">
                                <li>
                                    <Link href="/search" title="Search">
                                        <button className="icon-wrapper">
                                            <HiSearch className="size-6" />
                                        </button>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/watchlist" title="Watchlist">
                                        <button className="icon-wrapper">
                                            <HiOutlineBookmark className="size-6" />
                                        </button>
                                    </Link>
                                </li>

                                <li>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button title="Account Menu" className="icon-wrapper">
                                                <HiOutlineUser className="size-6" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#23252b] border-[#141519] text-white w-72 p-0 overflow-hidden shadow-xl rounded-md mt-2">
                                            <div className="p-4 bg-[#141519]">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[var(--app-background-crunchyroll-orange)] h-10 w-10 rounded-full flex items-center justify-center text-lg font-bold text-white uppercase">
                                                        {user.name?.[0] || "U"}
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <p className="text-base font-semibold truncate leading-tight">{user.name}</p>
                                                        <p className="text-xs text-gray-400 truncate mt-0.5">Premium Member</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2 space-y-1">
                                                <DropdownMenuItem asChild className="focus:bg-[#34363e] focus:text-white cursor-pointer rounded-sm py-2.5 px-3">
                                                    <Link href="/watchlist" className="flex items-center gap-3 w-full">
                                                        <HiOutlineBookmark className="size-5 text-gray-400" />
                                                        <span className="text-sm font-medium">Watchlist</span>
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem asChild className="focus:bg-[#34363e] focus:text-white cursor-pointer rounded-sm py-2.5 px-3">
                                                    <Link href="/history" className="flex items-center gap-3 w-full">
                                                        <HiOutlineClock className="size-5 text-gray-400" />
                                                        <span className="text-sm font-medium">History</span>
                                                    </Link>
                                                </DropdownMenuItem>


                                            </div>

                                            <DropdownMenuSeparator className="bg-[#141519] m-0" />

                                            <div className="p-2 space-y-1">


                                                <DropdownMenuItem
                                                    className="focus:bg-[#34363e] focus:text-white cursor-pointer rounded-sm py-2.5 px-3"
                                                    onSelect={(e) => {
                                                        e.preventDefault();
                                                        import("next-auth/react").then(({ signOut }) => {
                                                            signOut({ callbackUrl: "/" });
                                                        });
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3 w-full">
                                                        <LogOut className="size-5 text-gray-400" />
                                                        <span className="text-sm font-medium">Log Out</span>
                                                    </div>
                                                </DropdownMenuItem>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="header-actions">
                        <ul className="flex items-center">
                            <li>
                                <div className="flex items-center gap-3">
                                    <Link href="/login" title="Login">
                                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white hover:text-gray-300 transition-colors uppercase tracking-wider h-10">
                                            Log In
                                        </button>
                                    </Link>
                                    <Link href="/register" title="Sign Up">
                                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[var(--app-background-crunchyroll-orange)] hover:bg-[#ff3333] transition-colors uppercase tracking-wider h-10 clip-path-polygon">
                                            Sign Up
                                        </button>
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div
                tabIndex={0}
                role="button"
                data-active={
                    headerState === "open" || headerState === "genresListExpanded"
                }
                className="app-overlay"
                onClick={closeHeader}
                onKeyDown={closeHeader}
                aria-label="Close Menu"
            />
        </header>
    );
};

export default Header;
