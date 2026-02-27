import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/auth/verify-email
// Body: { email: string, code: string }
export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json(
                { error: "Email and verification code are required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        const pendingUser = await prisma.pendingUser.findUnique({
            where: { email: normalizedEmail },
        });

        if (!pendingUser) {
            return NextResponse.json(
                { error: "No pending registration found. Please register again." },
                { status: 400 }
            );
        }

        if (new Date() > pendingUser.expiresAt) {
            await prisma.pendingUser.delete({ where: { email: normalizedEmail } });
            return NextResponse.json(
                { error: "Verification code has expired. Please register again." },
                { status: 400 }
            );
        }

        if (pendingUser.code !== code.trim()) {
            return NextResponse.json(
                { error: "Incorrect verification code. Please try again." },
                { status: 400 }
            );
        }

        // 1. Move data to main User table
        await prisma.user.create({
            data: {
                name: pendingUser.name,
                email: pendingUser.email,
                password: pendingUser.password,
                phone: pendingUser.phone,
                class: pendingUser.studentClass,
                section: pendingUser.section,
                roll: pendingUser.roll,
                role: "STUDENT",
                paymentStatus: "PENDING",
                hasLoggedInBefore: false,
            },
        });

        // 2. Clean up the pending entry
        await prisma.pendingUser.delete({
            where: { email: normalizedEmail },
        });

        return NextResponse.json({
            message: "Registration complete! You can now log in.",
        });
    } catch (error) {
        console.error("Email verification error:", error);
        return NextResponse.json(
            { error: "Verification failed. Please try again." },
            { status: 500 }
        );
    }
}

// POST /api/auth/verify-email/resend  (handled in resend subfolder)
// This route also handles resending — called with action: "resend"
