"use client";

import { SessionProvider } from "next-auth/react";
import { SettingsProvider } from "@/providers/settings";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SettingsProvider>
                {children}
            </SettingsProvider>
        </SessionProvider>
    );
}
