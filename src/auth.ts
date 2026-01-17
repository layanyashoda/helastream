import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, limit } from "firebase/firestore"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import { User } from "@/types"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const email = credentials.email as string;
                const password = credentials.password as string;

                if (!email || !password) return null;

                try {
                    // 1. Fetch from Firestore (Client SDK)
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("email", "==", email), limit(1));
                    const snapshot = await getDocs(q);

                    if (!snapshot.empty) {
                        const userDoc = snapshot.docs[0];
                        const userData = userDoc.data();

                        // Check password
                        if (userData.password) {
                            const passwordsMatch = await bcrypt.compare(password, userData.password);

                            if (passwordsMatch) {
                                // Check if user is active
                                if (userData.status === 'inactive') {
                                    console.log(`Blocked login for inactive user: ${email}`);
                                    return null;
                                }

                                return {
                                    id: userDoc.id,
                                    name: userData.name,
                                    email: userData.email,
                                    role: userData.role,
                                };
                            }
                        }
                    } else {
                        // Fallback Mock
                        if (email === "admin@helastream.com" && password === "admin") {
                            return {
                                id: "mock-admin",
                                name: "Admin User",
                                email: "admin@helastream.com",
                                role: "admin",
                            }
                        }
                    }

                } catch (e) {
                    console.error("Auth error:", e);
                }

                return null
            },
        }),
    ],
})
