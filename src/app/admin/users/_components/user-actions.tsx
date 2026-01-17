"use client"

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserActions({ userId, currentStatus }: { userId: string, currentStatus: "active" | "inactive" }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        setIsLoading(true);
        const newStatus = currentStatus === "active" ? "inactive" : "active";

        try {
            const res = await fetch("/api/users", {
                method: "PATCH",
                body: JSON.stringify({ id: userId, status: newStatus }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                router.refresh(); // Refresh server component
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            variant={currentStatus === "active" ? "destructive" : "default"}
            size="sm"
            onClick={handleToggle}
            disabled={isLoading}
            className={currentStatus === "inactive" ? "bg-green-600 hover:bg-green-700" : ""}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentStatus === "active" ? "Deactivate" : "Activate"}
        </Button>
    )
}
