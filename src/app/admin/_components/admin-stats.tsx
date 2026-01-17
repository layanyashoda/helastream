
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileVideo, HardDrive, Users } from "lucide-react";

interface AdminStatsProps {
    totalMovies: number;
    processingMovies: number;
    featuredMovies: number;
    activeUsers: number;
    totalStorage: string;
}

export function AdminStats({ totalMovies, processingMovies, featuredMovies, activeUsers, totalStorage }: AdminStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-[#23252b] border-[#23252b] text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Movies
                    </CardTitle>
                    <FileVideo className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalMovies}</div>
                    <p className="text-xs text-gray-400">
                        +20.1% from last month
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-[#23252b] border-[#23252b] text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Featured Movies
                    </CardTitle>
                    <Activity className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{featuredMovies}</div>
                    <p className="text-xs text-gray-400">
                        Highlighted on home
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-[#23252b] border-[#23252b] text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Processing
                    </CardTitle>
                    <HardDrive className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{processingMovies}</div>
                    <p className="text-xs text-gray-400">
                        {processingMovies > 0 ? "Jobs currently running" : "No active jobs"}
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-[#23252b] border-[#23252b] text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Active Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeUsers}</div>
                    <p className="text-xs text-gray-400">
                        Registered users
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
