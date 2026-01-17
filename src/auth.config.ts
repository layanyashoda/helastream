
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [], // Providers added in auth.ts
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
            }
            return token
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
} satisfies NextAuthConfig
