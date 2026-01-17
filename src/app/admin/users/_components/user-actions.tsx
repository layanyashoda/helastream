"use client"

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, ShieldAlert, BadgeCheck, Ban } from "lucide-react";

export function UserActions({ userId, currentStatus, currentRole }: { userId: string, currentStatus: "active" | "inactive", currentRole: "admin" | "user" }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleStatusToggle = async () => {
        setIsLoading(true);
        const newStatus = currentStatus === "active" ? "inactive" : "active";

        try {
            const res = await fetch("/api/users", {
                method: "PATCH",
                body: JSON.stringify({ id: userId, status: newStatus }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                router.refresh();
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleRoleChange = async (newRole: "admin" | "user") => {
        if (!confirm(`Are you sure you want to make this user a ${newRole}?`)) return;
        setIsLoading(true);

        try {
            const res = await fetch("/api/users/role", {
                method: "POST",
                body: JSON.stringify({ userId, newRole }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                router.refresh();
            } else {
                console.error("Failed to update role");
                alert("Failed to update role");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating role");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-white hover:bg-[#23252b]">
                    <span className="sr-only">Open menu</span>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#141519] border-[#23252b] text-white">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#23252b]" />

                {/* Role Management */}
                {currentRole === "user" ? (
                    <DropdownMenuItem onClick={() => handleRoleChange("admin")} className="hover:bg-[#23252b] cursor-pointer text-green-500">
                        <Shield className="mr-2 h-4 w-4" />
                        Promote to Admin
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => handleRoleChange("user")} className="hover:bg-[#23252b] cursor-pointer text-yellow-500">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Demote to User
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-[#23252b]" />

                {/* Status Management */}
                <DropdownMenuItem onClick={handleStatusToggle} className={`hover:bg-[#23252b] cursor-pointer ${currentStatus === "active" ? "text-red-500" : "text-green-500"}`}>
                    {currentStatus === "active" ? (
                        <>
                            <Ban className="mr-2 h-4 w-4" />
                            Deactivate User
                        </>
                    ) : (
                        <>
                            <BadgeCheck className="mr-2 h-4 w-4" />
                            Activate User
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
