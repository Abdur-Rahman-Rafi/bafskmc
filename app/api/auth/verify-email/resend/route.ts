import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// POST /api/auth/verify-email/resend
// Body: { email: string }
export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const pendingUser = await prisma.pendingUser.findUnique({
            where: { email: normalizedEmail },
        });

        if (!pendingUser) {
            return NextResponse.json(
                { error: "No pending registration found for this email." },
                { status: 404 }
            );
        }

        const code = String(Math.floor(100000 + crypto.randomInt(900000)));
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Update the pending user with a new code and fresh expiry
        await prisma.pendingUser.update({
            where: { email: normalizedEmail },
            data: { code, expiresAt },
        });

        // Send (or log in dev)
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log("\n📧  RESENT VERIFICATION CODE (dev mode)");
            console.log(`To:   ${normalizedEmail}`);
            console.log(`Code: ${code}\n`);
        } else {
            const nodemailer = (await import("nodemailer")).default;
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || "smtp.gmail.com",
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: process.env.SMTP_SECURE === "true",
                auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            });
            const fromAddress = process.env.SMTP_FROM || "noreply@bafskmc.com";
            await transporter.sendMail({
                from: `"BAFSK Math Club" <${fromAddress}>`,
                to: normalizedEmail,
                subject: "Your New Verification Code — BAFSK Math Club",
                html: `<p>Your new verification code is: <strong style="font-size:24px;letter-spacing:6px;">${code}</strong></p><p>It expires in 10 minutes.</p>`,
            });
        }

        return NextResponse.json({ message: "A new verification code has been sent." });
    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json(
            { error: "Failed to resend code. Please try again." },
            { status: 500 }
        );
    }
}
