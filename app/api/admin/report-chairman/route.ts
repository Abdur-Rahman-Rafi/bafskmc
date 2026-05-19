import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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

        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        let page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        let yPos = height - 50;

        // Branding and Title
        page.drawText("BAFSKMC Alumni Association", {
            x: 50,
            y: yPos,
            size: 24,
            font: timesRomanBoldFont,
            color: rgb(0.788, 0.588, 0.169), // #C9962B equivalent
        });
        
        yPos -= 30;
        
        page.drawText("Confidential Report to Chairman", {
            x: 50,
            y: yPos,
            size: 14,
            font: timesRomanFont,
            color: rgb(0.4, 0.4, 0.4),
        });

        yPos -= 50;

        // Report Meta
        page.drawText(`Subject: ${title}`, {
            x: 50,
            y: yPos,
            size: 14,
            font: timesRomanBoldFont,
            color: rgb(0, 0, 0),
        });
        
        yPos -= 25;
        
        page.drawText(`Submitted By: ${session.user.name} (${session.user.role})`, {
            x: 50,
            y: yPos,
            size: 12,
            font: timesRomanFont,
        });

        yPos -= 20;

        page.drawText(`Date: ${new Date().toLocaleString()}`, {
            x: 50,
            y: yPos,
            size: 12,
            font: timesRomanFont,
        });

        yPos -= 40;

        // Content wrapping logic (simple)
        const maxWidth = width - 100;
        const words = content.split(' ');
        let line = '';
        const lines: string[] = [];
        for (const word of words) {
            const testLine = line + word + ' ';
            const textWidth = timesRomanFont.widthOfTextAtSize(testLine, 12);
            if (textWidth > maxWidth && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        // Draw content
        for (const lineText of lines) {
            if (yPos < 50) {
                // simple page break if needed
                page = pdfDoc.addPage([600, 800]);
                yPos = height - 50;
            }
            page.drawText(lineText, {
                x: 50,
                y: yPos,
                size: 12,
                font: timesRomanFont,
            });
            yPos -= 16;
        }

        const pdfBytes = await pdfDoc.save();
        const pdfBuffer = Buffer.from(pdfBytes);

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
