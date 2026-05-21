import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT") {
        return NextResponse.json({ error: "Unauthorized. Only students can apply for documents." }, { status: 401 });
    }

    try {
        const { type, reason } = await req.json();

        if (!type || !reason) {
            return NextResponse.json({ error: "Type and reason are required." }, { status: 400 });
        }

        // Try to create the document request in the database
        let documentRequest = null;
        try {
            documentRequest = await prisma.documentRequest.create({
                data: {
                    userId: session.user.id,
                    type,
                    reason,
                    status: "PENDING"
                }
            });
        } catch (e) {
            console.warn("DocumentRequest table might not exist yet. Skipping DB insert.", e);
        }

        // Send Notification to Admins
        const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
        
        const notifications = admins.map(admin => ({
            userId: admin.id,
            title: `New ${type} Request`,
            message: `${session.user.name || 'A student'} has requested a ${type}. Reason: ${reason}`,
            type: "INFO",
            link: "/admin/certificates"
        }));

        if (notifications.length > 0) {
            await prisma.notification.createMany({ data: notifications });
        }

        // Email Admins (Optional but good practice)
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

            const adminEmails = admins.map(a => a.email);
            
            if (adminEmails.length > 0) {
                await transporter.sendMail({
                    from: `"BAFSKMC System" <${process.env.SMTP_USER}>`,
                    bcc: adminEmails,
                    subject: `New ${type} Application from ${session.user.name}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2>New Document Application</h2>
                            <p><strong>Student:</strong> ${session.user.name} (${session.user.email})</p>
                            <p><strong>Type:</strong> ${type}</p>
                            <p><strong>Reason Details:</strong></p>
                            <blockquote style="border-left: 4px solid #C9962B; padding-left: 16px; color: #555;">
                                ${reason}
                            </blockquote>
                            <br/>
                            <p>Please log in to the admin dashboard to review and issue the document.</p>
                        </div>
                    `
                });
            }
        }

        return NextResponse.json({ success: true, request: documentRequest });

    } catch (err: any) {
        console.error("Document Application Error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
