import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { email, reason, collegeLogoUrl, clubLogoUrl } = await req.json();

        if (!email || !reason) {
            return NextResponse.json({ error: "Email and reason are required." }, { status: 400 });
        }

        // Validate user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        const userName = user.name || "Valued Member";

        // Generate PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([841.89, 595.28]); // A4 landscape
        const { width, height } = page.getSize();

        // Draw Border
        const goldColor = rgb(0.788, 0.588, 0.168); // #C9962B approx
        page.drawRectangle({
            x: 20, y: 20,
            width: width - 40, height: height - 40,
            borderColor: goldColor,
            borderWidth: 5,
        });
        page.drawRectangle({
            x: 28, y: 28,
            width: width - 56, height: height - 56,
            borderColor: goldColor,
            borderWidth: 1,
        });

        // Register fontkit for custom fonts
        const fontkit = require('@pdf-lib/fontkit');
        pdfDoc.registerFontkit(fontkit);

        // Add standard Fonts
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Fetch signature handwriting font (Great Vibes)
        let signatureFont = regularFont;
        try {
            const fontUrl = "https://raw.githubusercontent.com/google/fonts/main/ofl/herrvonmuellerhoff/HerrVonMuellerhoff-Regular.ttf";
            const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
            signatureFont = await pdfDoc.embedFont(fontBytes);
        } catch (e) {
            console.error("Failed to load signature font, falling back to regular font", e);
            signatureFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
        }

        // Helper function to load and draw images robustly
        const drawImage = async (url: string, isRight: boolean = false) => {
            if (!url) return;
            try {
                const imgBytes = await fetch(url).then(res => res.arrayBuffer());
                let image;
                try {
                    image = await pdfDoc.embedPng(imgBytes);
                } catch {
                    image = await pdfDoc.embedJpg(imgBytes);
                }
                const dims = image.scaleToFit(75, 75);
                // Position logos at the top left and top right
                const x = isRight ? width - dims.width - 60 : 60;
                page.drawImage(image, {
                    x,
                    y: height - dims.height - 50,
                    width: dims.width,
                    height: dims.height,
                });
            } catch (e) {
                console.error("Failed to load or embed image from url:", url, e);
            }
        };

        // College Logo (Top Left)
        await drawImage(collegeLogoUrl, false);
        // Club Logo (Top Right)
        await drawImage(clubLogoUrl, true);

        // Draw Texts
        const drawCenteredText = (text: string, yPos: number, size: number, font: any, color: any = rgb(0, 0, 0)) => {
            const textWidth = font.widthOfTextAtSize(text, size);
            page.drawText(text, {
                x: (width / 2) - (textWidth / 2),
                y: yPos,
                size,
                font,
                color,
            });
        };

        drawCenteredText("CERTIFICATE OF ACHIEVEMENT", height - 160, 36, boldFont, goldColor);
        drawCenteredText("This is proudly presented to", height - 240, 18, regularFont, rgb(0.3, 0.3, 0.3));

        drawCenteredText(userName.toUpperCase(), height - 300, 42, boldFont, rgb(0.1, 0.1, 0.1));

        // Draw line under name
        page.drawLine({
            start: { x: width / 2 - 200, y: height - 310 },
            end: { x: width / 2 + 200, y: height - 310 },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8)
        });

        drawCenteredText("For outstanding performance and achieving:", height - 380, 16, regularFont, rgb(0.3, 0.3, 0.3));
        drawCenteredText(reason, height - 430, 24, boldFont, goldColor);

        // Date & Signature
        const dateStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        page.drawText(`Date: ${dateStr}`, { x: 100, y: 80, size: 14, font: regularFont });
        page.drawLine({ start: { x: 90, y: 75 }, end: { x: 250, y: 75 }, thickness: 1 });

        // Authorized Signature (Rafi Abdur Rahman)
        page.drawText("A.R Rafi", { x: width - 250 + 20, y: 90, size: 28, font: signatureFont, color: rgb(0.1, 0.2, 0.6), rotate: degrees(4) });
        page.drawText("Authorized Signature", { x: width - 250, y: 60, size: 14, font: regularFont });
        page.drawLine({ start: { x: width - 260, y: 80 }, end: { x: width - 100, y: 80 }, thickness: 1 });

        const pdfBytes = await pdfDoc.save();
        const pdfBuffer = Buffer.from(pdfBytes);

        // Send Email
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
                from: `"BAFSKMC Administration" <${process.env.SMTP_USER}>`,
                to: email,
                subject: `Your Certificate: ${reason}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h2>Congratulations ${userName}!</h2>
                        <p>We are delighted to present you with the attached certificate for <strong>${reason}</strong>.</p>
                        <p>Your hard work and dedication have been recognized by the club administration. Please find your official certificate attached to this email.</p>
                        <br/>
                        <p>Best Regards,</p>
                        <p><strong>BAFSK Math Club</strong></p>
                    </div>
                `,
                attachments: [
                    {
                        filename: `${userName.replace(/\s+/g, '_')}_Certificate.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            });
        } else {
            console.log("[Mock Email] Certificate generated and would be sent to", email);
            console.log("[Mock Email] Attachment size:", pdfBuffer.length, "bytes");
        }

        return NextResponse.json({ success: true, message: "Certificate issued and emailed successfully." });

    } catch (err: any) {
        console.error("Certificate Issue Error:", err);
        return NextResponse.json({ error: "Internal server error during certificate generation." }, { status: 500 });
    }
}
