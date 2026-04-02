import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { subject, message } = await req.json();

        if (!subject || !message) {
            return NextResponse.json({ error: "Subject and Message are required." }, { status: 400 });
        }

        // Fetch all active users (students)
        const users = await prisma.user.findMany({
            where: { role: "STUDENT" },
            select: { email: true }
        });
        
        const emails = users.map(u => u.email).filter(Boolean);

        if (emails.length === 0) {
            return NextResponse.json({ error: "No users found to email." }, { status: 404 });
        }

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || "smtp.gmail.com",
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            // Using BCC to send to all at once and prevent them from seeing each other's emails
            await transporter.sendMail({
                from: `"BAFSKMC Communications" <${process.env.SMTP_USER}>`,
                bcc: emails as string[],
                subject: subject,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h2 style="color: #C9962B;">BAFSK Math Club</h2>
                        <div style="margin-top: 20px; white-space: pre-wrap; font-size: 16px; line-height: 1.6;">${message}</div>
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
                            This is an automated administrative broadcast. Please do not reply to this email.
                        </div>
                    </div>
                `,
            });
        } else {
            console.log(`[Mock Broadcast] To: ${emails.length} users | Subject: ${subject}`);
            console.log(message);
        }

        return NextResponse.json({ success: true, message: `Broadcast successfully sent to ${emails.length} users.` });
    } catch (err: any) {
        console.error("Broadcast Error:", err);
        return NextResponse.json({ error: "Failed to send broadcast mail." }, { status: 500 });
    }
}
