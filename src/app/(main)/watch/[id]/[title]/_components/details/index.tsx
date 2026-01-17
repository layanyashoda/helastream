"use client";

import { useState } from "react";

import "./index.css";

const Details: React.FC<{
    description: string;
    details: Record<string, string>;
}> = ({ description, details }) => {
    const [detailsIsExpanded, setDetailsIsExpanded] = useState(false);

    function toogleDescriptionIsExpanded() {
        setDetailsIsExpanded((prev) => !prev);
    }

    return (
        <div className="text-sm">
            <div
                className={`overflow-hidden transition-all duration-300 ${detailsIsExpanded ? "max-h-full" : "max-h-24 relative"}`}
            >
                <div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base mb-6">
                        {description}
                    </p>

                    <div className="grid gap-y-2 border-t border-[#23252b] pt-4">
                        {Object.keys(details).map((key, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-[120px_1fr] items-baseline"
                            >
                                <span className="text-gray-400 font-medium">
                                    {key}
                                </span>

                                <span className="text-white font-medium">
                                    {details[key]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {!detailsIsExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#141519] to-transparent pointer-events-none" />
                )}
            </div>

            <button
                onClick={toogleDescriptionIsExpanded}
                className="mt-4 text-[var(--app-background-crunchyroll-orange)] hover:text-[#ff8540] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
            >
                {detailsIsExpanded ? "Show Less" : "Show More"}
            </button>
        </div>
    );
};

export default Details;
