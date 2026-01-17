"use client"

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export function AnnouncementBar({ message }: { message: string }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="w-full bg-[#ff640a] text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-between relative z-50">
            <div className="flex-1 flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{message}</span>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="hover:bg-black/20 p-1 rounded transition-colors absolute right-2"
                aria-label="Dismiss announcement"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
