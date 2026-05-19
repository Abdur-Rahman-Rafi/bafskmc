import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, content } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
        }

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const buffers: Buffer[] = [];
            
            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);

            // Branding and Title
            doc.fontSize(24).fillColor('#C9962B').text("BAFSKMC Alumni Association", { align: "center" });
            doc.moveDown(0.5);
            doc.fontSize(12).fillColor('#666666').text("Confidential Report to Chairman", { align: "center" });
            doc.moveDown(2);

            // Report Meta
            doc.fontSize(14).fillColor('#000000').text(`Subject: ${title}`, { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12).text(`Submitted By: ${session.user.name} (${session.user.role})`);
            doc.text(`Date: ${new Date().toLocaleString()}`);
            doc.moveDown(2);

            // Report Content
            doc.fontSize(12).text(content, { align: 'justify', lineGap: 4 });
            
            doc.end();
        });

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

            const chairmanEmail = "rahmanrafi517@gmail.com";

            await transporter.sendMail({
                from: `"BAFSKMC Portal" <${process.env.SMTP_USER}>`,
                to: chairmanEmail,
                subject: `New Report from Panel Member: ${title}`,
                html: `
                    <p>Dear Chairman,</p>
                    <p>A new confidential report has been submitted by <strong>${session.user.name}</strong>.</p>
                    <p>Please find the attached PDF document for the full details of the report.</p>
                    <br/>
                    <p>Best regards,<br/>BAFSKMC Automated System</p>
                `,
                attachments: [
                    {
                        filename: `Report_${new Date().getTime()}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            });

            return NextResponse.json({ success: true, message: "Report generated and sent successfully." });
        } else {
            console.warn("SMTP settings are missing. Cannot send report.");
            return NextResponse.json({ error: "Email configuration is missing on the server." }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Report Generation Error:", error);
        return NextResponse.json({ 
            error: "Failed to generate or send the report.",
            details: error?.message || String(error),
            stack: error?.stack 
        }, { status: 500 });
    }
}
