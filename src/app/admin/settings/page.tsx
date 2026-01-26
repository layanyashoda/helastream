"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Code } from "lucide-react";
import { useRouter } from "next/navigation";

interface Settings {
    maintenanceMode: boolean;
    announcementEnabled: boolean;
    announcementMessage: string;
    // Developer Options
    hlsDebugOverlay: boolean;
    showPerformanceMetrics: boolean;
    verboseLogging: boolean;
    disableAnalytics: boolean;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        maintenanceMode: false,
        announcementEnabled: false,
        announcementMessage: "",
        hlsDebugOverlay: false,
        showPerformanceMetrics: false,
        verboseLogging: false,
        disableAnalytics: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        maintenanceMode: data.maintenanceMode || false,
                        announcementEnabled: data.announcementEnabled || false,
                        announcementMessage: data.announcementMessage || "",
                        hlsDebugOverlay: data.hlsDebugOverlay || false,
                        showPerformanceMetrics: data.showPerformanceMetrics || false,
                        verboseLogging: data.verboseLogging || false,
                        disableAnalytics: data.disableAnalytics || false,
                    });
                }
            } catch (e) {
                console.error("Failed to load settings", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                router.refresh();
                alert("Settings saved!");
            } else {
                alert("Failed to save settings");
            }
        } catch (e) {
            console.error("Failed to save", e);
            alert("Error saving settings");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Platform Settings</h1>
                <p className="text-muted-foreground">Manage global site configurations.</p>
            </div>

            <Card className="bg-[#141519] border-[#23252b]">
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Control site availability and global messaging.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Maintenance Mode */}
                    <div className="flex items-center justify-between p-4 border rounded-lg border-[#23252b]">
                        <div className="space-y-0.5">
                            <Label className="text-base">Maintenance Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Disable public access to the site. Admins can still access.
                            </p>
                        </div>
                        <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(v) => setSettings(prev => ({ ...prev, maintenanceMode: v }))}
                        />
                    </div>

                    {/* Announcement Bar */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">Global Announcement Bar</Label>
                            <Switch
                                checked={settings.announcementEnabled}
                                onCheckedChange={(v) => setSettings(prev => ({ ...prev, announcementEnabled: v }))}
                            />
                        </div>

                        {settings.announcementEnabled && (
                            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="announcement">Message</Label>
                                <Input
                                    id="announcement"
                                    placeholder="e.g. Server maintenance scheduled for 10 PM..."
                                    value={settings.announcementMessage}
                                    onChange={(e) => setSettings(prev => ({ ...prev, announcementMessage: e.target.value }))}
                                />
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>

            {/* Developer Options */}
            <Card className="bg-[#141519] border-[#23252b]">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Developer Options</CardTitle>
                    </div>
                    <CardDescription>Debug and development settings. Use with caution.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* HLS Debug Overlay */}
                    <div className="flex items-center justify-between p-4 border rounded-lg border-[#23252b]">
                        <div className="space-y-0.5">
                            <Label className="text-base">HLS Debug Overlay</Label>
                            <p className="text-sm text-muted-foreground">
                                Show HLS quality levels and source info on video player.
                            </p>
                        </div>
                        <Switch
                            checked={settings.hlsDebugOverlay}
                            onCheckedChange={(v) => setSettings(prev => ({ ...prev, hlsDebugOverlay: v }))}
                        />
                    </div>

                    {/* Performance Metrics */}
                    <div className="flex items-center justify-between p-4 border rounded-lg border-[#23252b]">
                        <div className="space-y-0.5">
                            <Label className="text-base">Performance Metrics</Label>
                            <p className="text-sm text-muted-foreground">
                                Display page load times and API response metrics.
                            </p>
                        </div>
                        <Switch
                            checked={settings.showPerformanceMetrics}
                            onCheckedChange={(v) => setSettings(prev => ({ ...prev, showPerformanceMetrics: v }))}
                        />
                    </div>

                    {/* Verbose Logging */}
                    <div className="flex items-center justify-between p-4 border rounded-lg border-[#23252b]">
                        <div className="space-y-0.5">
                            <Label className="text-base">Verbose Logging</Label>
                            <p className="text-sm text-muted-foreground">
                                Enable detailed console logs for debugging.
                            </p>
                        </div>
                        <Switch
                            checked={settings.verboseLogging}
                            onCheckedChange={(v) => setSettings(prev => ({ ...prev, verboseLogging: v }))}
                        />
                    </div>

                    {/* Disable Analytics */}
                    <div className="flex items-center justify-between p-4 border rounded-lg border-[#23252b]">
                        <div className="space-y-0.5">
                            <Label className="text-base">Disable Analytics</Label>
                            <p className="text-sm text-muted-foreground">
                                Stop sending usage data for testing purposes.
                            </p>
                        </div>
                        <Switch
                            checked={settings.disableAnalytics}
                            onCheckedChange={(v) => setSettings(prev => ({ ...prev, disableAnalytics: v }))}
                        />
                    </div>

                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="bg-[#ff640a] hover:bg-[#e05200] text-white">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    )
}
