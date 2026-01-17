import { Wrench } from "lucide-react";

export default function MaintenanceScreen() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-white space-y-4">
            <Wrench className="h-16 w-16 text-[#ff640a]" />
            <h1 className="text-4xl font-bold tracking-tight">Under Maintenance</h1>
            <p className="text-muted-foreground text-center max-w-md">
                We are currently performing scheduled maintenance to improve your experience. We will be back shortly.
            </p>
        </div>
    )
}
