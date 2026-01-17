
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const user = req.auth?.user as any; // Cast for role property
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isAuthRoute = nextUrl.pathname.includes("/login") || nextUrl.pathname.includes("/register"); // Simple check

    if (isApiAuthRoute) {
        return; // Don't block auth api routes
    }

    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/api/auth/signin", nextUrl));
        }
        if (user?.role !== "admin") {
            // Redirect non-admins to home
            return NextResponse.redirect(new URL("/", nextUrl));
        }
        return;
    }

    const isDiscoverRoute = nextUrl.pathname.startsWith("/discover");
    if (isDiscoverRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    return;
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
