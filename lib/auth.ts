import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                // Normalize email for case-insensitive lookup
                const normalizedEmail = credentials.email.toLowerCase().trim();

                const user = await prisma.user.findUnique({
                    where: {
                        email: normalizedEmail,
                    },
                });

                if (!user) {
                    console.log(`Auth failed: User ${normalizedEmail} not found`);
                    throw new Error("Invalid email or password");
                }

                if (!user.password) {
                    console.log(`Auth failed: User ${normalizedEmail} has no password set`);
                    throw new Error("Invalid email or password");
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    console.log(`Auth failed: Password incorrect for ${normalizedEmail}`);
                    throw new Error("Invalid email or password");
                }

                if (!user.emailVerified) {
                    console.log(`Auth failed: User ${normalizedEmail} has not verified their email`);
                    throw new Error("Please verify your email before logging in. Check your inbox for the verification code.");
                }

                console.log(`Auth success: ${normalizedEmail} logged in`);

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
