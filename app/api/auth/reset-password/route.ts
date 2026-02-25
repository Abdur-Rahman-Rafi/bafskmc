import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
        }

        // Find the token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!resetToken) {
            return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
        }

        // Check expiry
        if (resetToken.expiresAt < new Date()) {
            await prisma.passwordResetToken.delete({ where: { token } });
            return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user's password
        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword }
        });

        // Delete the used token
        await prisma.passwordResetToken.delete({ where: { token } });

        return NextResponse.json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Failed to reset password. Please try again." },
            { status: 500 }
        );
    }
}

// GET — validate token (used to pre-check on page load)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ valid: false, error: "No token provided" }, { status: 400 });
        }

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            return NextResponse.json({ valid: false, error: "Invalid or expired token" });
        }

        return NextResponse.json({ valid: true, email: resetToken.email });

    } catch (error) {
        return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
    }
}
