"use client";

import { KeyboardEvent, MouseEvent, Dispatch, SetStateAction } from "react";
import Link from "next/link";

import { triggerCallbackOnClickOrOnKeydown } from "@/lib/utils";

import { HeaderState } from "./types";

import { HiMiniBars3, HiMiniChevronDown } from "react-icons/hi2";
import { FaCaretDown } from "react-icons/fa";

import { NAV_LINKS, GENRES } from "@/data/header";
import "./header-menu.css";

const HeaderMenu: React.FC<{
    headerState: HeaderState;
    setHeaderState: Dispatch<SetStateAction<HeaderState>>;
}> = ({ headerState, setHeaderState }) => {
    function toogleMenu() {
        setHeaderState((prev) => (prev === "close" ? "open" : "close"));
    }

    function toogleGenresList(e: KeyboardEvent | MouseEvent) {
        triggerCallbackOnClickOrOnKeydown(e, () =>
            setHeaderState((prev) =>
                prev === "genresListExpanded" ? "open" : "genresListExpanded",
            ),
        );
    }

    return (
        <div className="flex items-center">
            {/* Mobile Hamburger */}
            <button
                data-active={headerState === "open"}
                onClick={toogleMenu}
                className="icon-wrapper md:!hidden"
            >
                <HiMiniBars3 className="size-6" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 ml-4">
                {NAV_LINKS.map((link) => {
                    if (link.title === "Categories") {
                        return (
                            <div key={link.title} className="relative group">
                                <button className="flex items-center gap-1 text-sm font-semibold hover:text-[var(--app-text-crunchyroll-orange)] transition-colors">
                                    {link.title}
                                    <FaCaretDown className="size-3" />
                                </button>
                                {/* Dropdown for Categories */}
                                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-[var(--app-overlay-secondary)] border border-[var(--app-border-primary)] p-4 rounded-md shadow-lg min-w-[200px] grid grid-cols-2 gap-x-4 gap-y-2">
                                        {link.children?.map((child) => (
                                            <Link
                                                key={child.title}
                                                href={child.href}
                                                className="text-sm hover:text-[var(--app-text-crunchyroll-orange)] transition-colors whitespace-nowrap"
                                            >
                                                {child.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <Link
                            key={link.title}
                            href={link.href || "#"}
                            className="text-sm font-semibold hover:text-[var(--app-text-crunchyroll-orange)] transition-colors"
                        >
                            {link.title}
                        </Link>
                    );
                })}
            </nav>

            {/* Mobile Menu Dropdown */}
            <div
                data-active={
                    headerState === "open" || headerState === "genresListExpanded"
                }
                className="menu-dropdown md:hidden"
            >
                <nav className="menu-dropdown-content">
                    <section className="menu-section border-b-2 border-[var(--app-border-primary)]">
                        <small className="small-title">Menu</small>

                        <ul>
                            {NAV_LINKS.map((link) => (
                                <li key={link.title} className="select-none">
                                    {link?.children ? (
                                        <div>
                                            <div
                                                data-active={headerState === "genresListExpanded"}
                                                onClick={toogleGenresList}
                                                onKeyDown={toogleGenresList}
                                                tabIndex={0}
                                                role="button"
                                                className="menu-title cursor-pointer"
                                            >
                                                <span>{link.title}</span>

                                                <span className="menu-title-icon">
                                                    <HiMiniChevronDown className="size-6" />
                                                </span>
                                            </div>

                                            <ul
                                                data-active={headerState === "genresListExpanded"}
                                                className="hidden data-[active=true]:block data-[active=true]:bg-[var(--app-background-tertiary)]"
                                            >
                                                {link.children.map((child) => (
                                                    <li key={child.title}>
                                                        <Link
                                                            href={child.href}
                                                            prefetch={false}
                                                            className="submenu-title"
                                                            onClick={() => setHeaderState("close")}
                                                        >
                                                            <h5>{child.title}</h5>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            prefetch={false}
                                            className="menu-title"
                                            onClick={() => setHeaderState("close")}
                                        >
                                            <span>{link.title}</span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>
                </nav>
            </div>
        </div>
    );
};

export default HeaderMenu;
