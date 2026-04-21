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
        const { subject, message, audience, newSince, senderName, specificEmail } = await req.json();

        if (!subject || !message) {
            return NextResponse.json({ error: "Subject and Message are required." }, { status: 400 });
        }

        let emails: string[] = [];

        if (audience === "BCC" && specificEmail) {
            emails = specificEmail.split(/[;,]/).map((e: string) => e.trim()).filter((e: string) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
        } else if (audience === "SPECIFIC" && specificEmail && !specificEmail.startsWith("@")) {
            const trimmed = specificEmail.trim();
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                emails = [trimmed];
            }
        } else {
            // Build query constraints based on audience selection
            const queryConstraints: any = { role: "STUDENT" };
            if (audience === "NEW" && newSince) {
                queryConstraints.createdAt = { gte: new Date(newSince) };
            }
            if (audience === "SPECIFIC" && specificEmail?.startsWith("@")) {
                queryConstraints.email = { endsWith: specificEmail.trim() };
            }

            // Fetch all specific target active users (students)
            const users = await prisma.user.findMany({
                where: queryConstraints,
                select: { email: true }
            });
            
            // Trim and validate fetched emails
            emails = users
                .map((u: any) => u.email.trim())
                .filter((e: string) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
        }

        if (emails.length === 0) {
            return NextResponse.json({ error: "No valid recipients found to email." }, { status: 404 });
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

            // Fallback sender name if none provided
            const finalSenderName = senderName || "BAFSKMC Communications";

            // Gmail/SMTP Chunking to prevent "Address Not Found" cascading and limit issues
            // We chunk the emails to handle them in batches of 50
            const CHUNK_SIZE = 50;
            const chunks = [];
            for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
                chunks.push(emails.slice(i, i + CHUNK_SIZE));
            }

            let sentCount = 0;
            let failureCount = 0;

            for (const chunk of chunks) {
                try {
                    await transporter.sendMail({
                        from: `"${finalSenderName}" <${process.env.SMTP_USER}>`,
                        bcc: chunk,
                        subject: subject,
                        html: `
                            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background-color: #0d0d0d; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #333;">
                                <div style="background: linear-gradient(135deg, #1A1200 0%, #0d0d0d 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #C9962B;">
                                    <h1 style="color: #C9962B; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">BAFSK MATH CLUB</h1>
                                    <p style="color: #F0C040; font-size: 11px; text-transform: uppercase; letter-spacing: 4px; margin-top: 8px;">Official Communication Protocol</p>
                                </div>
                                <div style="padding: 40px 30px; background-color: #151515;">
                                    <div style="font-size: 16px; line-height: 1.8; color: #e5e7eb; white-space: pre-wrap;">${message}</div>
                                </div>
                                <div style="padding: 30px; text-align: center; background-color: #0d0d0d; border-top: 1px solid #222;">
                                    <p style="font-size: 12px; color: #666; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                                        Sent by ${finalSenderName}
                                    </p>
                                    <p style="font-size: 11px; color: #444; margin-top: 10px;">
                                        This is an automated administrative broadcast. Please do not reply directly to this email address.
                                    </p>
                                </div>
                            </div>
                        `,
                    });
                    sentCount += chunk.length;
                } catch (err: any) {
                    console.error("Batch Send Error:", err);
                    failureCount += chunk.length;
                    // If it's a specific address error, we log but continue other batches
                }
            }

            if (sentCount === 0 && emails.length > 0) {
                return NextResponse.json({ error: "Failed to send emails. Gmail rejected all batches. Check SMTP settings or recipient addresses." }, { status: 500 });
            }

            return NextResponse.json({ 
                success: true, 
                message: `Broadcast sent to ${sentCount} recipients.${failureCount > 0 ? ` ${failureCount} failed in specific batches.` : ""}` 
            });

        } else {
            console.log(`[Mock Broadcast] To: ${emails.length} users | Subject: ${subject}`);
            console.log(message);
            return NextResponse.json({ success: true, message: `Mock broadcast logged for ${emails.length} users.` });
        }
    } catch (err: any) {
        console.error("Broadcast Execution Error:", err);
        return NextResponse.json({ error: "Internal server error during broadcast processing." }, { status: 500 });
    }
}
