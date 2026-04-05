import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const data = await req.json();

        // Check current app to prevent resending if already sent
        const currentApp = await prisma.panelApplication.findUnique({
            where: { id }
        });

        if (!currentApp) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Update fields provided (status, vivaTime, vivaLink, confirmationEmailSent)
        const updateData: any = {};
        if (data.status !== undefined) updateData.status = data.status;
        if (data.vivaTime !== undefined) updateData.vivaTime = data.vivaTime ? new Date(data.vivaTime) : null;
        if (data.vivaLink !== undefined) updateData.vivaLink = data.vivaLink;
        if (data.confirmationEmailSent !== undefined) updateData.confirmationEmailSent = data.confirmationEmailSent;

        const application = await prisma.panelApplication.update({
            where: { id },
            data: updateData
        });

        // Actual Email Sending Logic
        if (data.confirmationEmailSent === true && currentApp.confirmationEmailSent === false && application.email) {
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

                await transporter.sendMail({
                    from: `"BAFSK Math Club" <${process.env.SMTP_USER}>`,
                    to: application.email,
                    subject: "Panel Application Form Fill-up Confirmation",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h2 style="color: #C9962B;">Application Received</h2>
                            <p>Dear ${application.name},</p>
                            <p>We are writing to confirm that we have successfully received your form fill-up context for the BAFSK Math Club Panel.</p>
                            <p>Your application is currently marked as: <strong>${application.status}</strong></p>
                            <p>Please keep an eye on your email for further updates, particularly regarding interview/viva scheduling.</p>
                            <br/>
                            <p>Best Regards,</p>
                            <p><strong>BAFSK Math Club Team</strong></p>
                        </div>
                    `,
                }).catch(e => console.error("Email send failed:", e));
            } else {
                console.log("[Mock Email] Application confirmation sent to:", application.email);
            }
        }

        return NextResponse.json(application);
    } catch (err: any) {
        console.error("Error updating application:", err);
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }
}
