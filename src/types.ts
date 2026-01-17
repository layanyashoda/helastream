
export type User = {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: "admin" | "user";
    status: "active" | "inactive";
    createdAt?: string | Date;
};

export type Movie = {
    id: string;
    title: string;
    description?: string;
    year?: number;
    genre?: string;
    status: "Processing" | "Ready" | "Error";

    // Media Assets
    videoUrl: string; // Was streamingUrl
    thumbnailUrl?: string; // Auto-generated
    posterUrl?: string;   // User uploaded portrait

    // Featured Content
    isFeatured?: boolean;
    titleImageUrl?: string; // For hero overlay
    bannerImageUrl?: string; // For hero background

    // Tech
    filename: string;
    size?: number;
    uploadDate: string | Date;
};
