"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DeveloperSettings {
    hlsDebugOverlay: boolean;
    showPerformanceMetrics: boolean;
    verboseLogging: boolean;
    disableAnalytics: boolean;
}

interface SettingsContextType {
    settings: DeveloperSettings;
    isLoading: boolean;
    refetch: () => Promise<void>;
}

const defaultSettings: DeveloperSettings = {
    hlsDebugOverlay: false,
    showPerformanceMetrics: false,
    verboseLogging: false,
    disableAnalytics: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within SettingsProvider");
    }
    return context;
}

// Optional hook that doesn't throw if used outside provider (for components that may or may not have access)
export function useSettingsSafe(): SettingsContextType {
    const context = useContext(SettingsContext);
    return context || { settings: defaultSettings, isLoading: false, refetch: async () => { } };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<DeveloperSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    hlsDebugOverlay: data.hlsDebugOverlay || false,
                    showPerformanceMetrics: data.showPerformanceMetrics || false,
                    verboseLogging: data.verboseLogging || false,
                    disableAnalytics: data.disableAnalytics || false,
                });

                // Apply verbose logging immediately
                if (data.verboseLogging) {
                    (window as any).__HELA_VERBOSE_LOGGING__ = true;
                    console.log("[HelaStream] Verbose logging enabled");
                } else {
                    (window as any).__HELA_VERBOSE_LOGGING__ = false;
                }

                // Apply disable analytics
                if (data.disableAnalytics) {
                    (window as any).__HELA_ANALYTICS_DISABLED__ = true;
                    console.log("[HelaStream] Analytics disabled");
                } else {
                    (window as any).__HELA_ANALYTICS_DISABLED__ = false;
                }
            }
        } catch (e) {
            console.error("Failed to load developer settings", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, isLoading, refetch: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

// Utility function for verbose logging
export function verboseLog(...args: any[]) {
    if (typeof window !== "undefined" && (window as any).__HELA_VERBOSE_LOGGING__) {
        console.log("[VERBOSE]", ...args);
    }
}

// Utility function to check if analytics is disabled
export function isAnalyticsDisabled(): boolean {
    if (typeof window !== "undefined") {
        return (window as any).__HELA_ANALYTICS_DISABLED__ === true;
    }
    return false;
}
