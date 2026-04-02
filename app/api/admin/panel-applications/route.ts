import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assumed auth location
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const apps = await prisma.panelApplication.findMany({
            orderBy: { createdAt: "desc" },
        });

        const statusConfig = await prisma.siteConfig.findUnique({
            where: { key: "PANEL_APPLICATION_STATUS" }
        });

        return NextResponse.json({ apps, isOpen: statusConfig?.value !== "CLOSED" });
    } catch (err: any) {
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { action, announcementTitle, announcementContent } = await req.json();

        if (action === "OPEN_APPLICATIONS") {
            // 1. Create News Announcement
            await prisma.news.create({
                data: {
                    title: announcementTitle || "Panel Applications are now OPEN!",
                    content: announcementContent || "We are happy to announce that the Panel Applications for BAFSK Math Club are now open. Apply through the panel portal to join the executive team.",
                    type: "NOTICE",
                    authorId: session.user.id,
                }
            });

            // 2. Fetch all student emails to notify
            const users = await prisma.user.findMany({
                where: { role: "STUDENT" },
                select: { email: true }
            });
            const emails = users.map(u => u.email).filter(Boolean);

            // 3. Send automated emails (Mock or Real via nodemailer)
            // Using standard env var setup if exists
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

                // Send in chunks or BCC all
                // For simplicity, we send one BCC email
                if (emails.length > 0) {
                    await transporter.sendMail({
                        from: `"BAFSK Math Club" <${process.env.SMTP_USER}>`,
                        bcc: emails as string[],
                        subject: announcementTitle || "Panel Applications are Open!",
                        html: `<p>${announcementContent || "Panel applications are now officially open. Visit our website to apply!"}</p>`,
                    });
                }
            } else {
                console.log("[Mock Email] Sending application announcement to:", emails.length, "students.");
            }

            // Set Config to OPEN
            await prisma.siteConfig.upsert({
                where: { key: "PANEL_APPLICATION_STATUS" },
                update: { value: "OPEN" },
                create: { key: "PANEL_APPLICATION_STATUS", value: "OPEN" }
            });

            return NextResponse.json({ success: true, message: "Applications opened, announcement posted and emails sent." });
        }

        if (action === "CLOSE_APPLICATIONS") {
            await prisma.siteConfig.upsert({
                where: { key: "PANEL_APPLICATION_STATUS" },
                update: { value: "CLOSED" },
                create: { key: "PANEL_APPLICATION_STATUS", value: "CLOSED" }
            });
            return NextResponse.json({ success: true, message: "Applications are now closed." });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (err: any) {
        console.error("Action error:", err);
        return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
    }
}
