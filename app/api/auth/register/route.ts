import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ── Email helper ──────────────────────────────────────────────────────────────
async function sendVerificationEmail(to: string, code: string, name: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧  EMAIL VERIFICATION CODE (dev mode)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`To:   ${to}`);
    console.log(`Code: ${code}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return;
  }

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
    to,
    subject: "Verify Your Email — BAFSK Math Club",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#151515;border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,0.05);">
        <tr>
          <td style="background:linear-gradient(135deg,#C9A84C,#F0C040);padding:40px;text-align:center;">
            <div style="font-size:28px;font-weight:900;color:#000;letter-spacing:-1px;text-transform:uppercase;font-style:italic;">BAFSK MATH CLUB</div>
            <div style="font-size:10px;font-weight:700;color:rgba(0,0,0,0.6);letter-spacing:4px;text-transform:uppercase;margin-top:4px;">BAF Shaheen College Kurmitola</div>
          </td>
        </tr>
        <tr>
          <td style="padding:48px 40px;">
            <div style="font-size:24px;font-weight:900;color:#fff;letter-spacing:-0.5px;margin-bottom:12px;">Verify Your Email</div>
            <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.7;margin:0 0 32px;">
              Hey <strong style="color:#fff;">${name}</strong>, welcome to BAFSK Math Club! Enter the code below to verify your email address.
            </p>
            <div style="background:#1A1A1A;border:1px solid rgba(201,168,76,0.3);border-radius:16px;padding:32px;text-align:center;margin-bottom:32px;">
              <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#F0C040;font-family:'Courier New',monospace;">${code}</div>
              <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:12px 0 0;">This code expires in <strong style="color:rgba(255,255,255,0.5);">10 minutes</strong></p>
            </div>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:20px;">
              <p style="color:rgba(255,255,255,0.3);font-size:12px;line-height:1.6;margin:0;">
                If you didn't create an account with BAFSK Math Club, you can safely ignore this email.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.05);padding:24px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.15);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">BAFSK Math Club • BAF Shaheen College Kurmitola</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim(),
  });
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { name, email, password, studentClass, section, roll, phone } =
      await req.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: "Name, email, password and phone are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if a VERIFIED account already exists in the main User table
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // 2. Clean up any previous PENDING registration for this email
    await prisma.pendingUser.deleteMany({
      where: { email: normalizedEmail },
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Generate 6-digit OTP
    const code = String(Math.floor(100000 + crypto.randomInt(900000)));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 4. Save to PENDING table (not the main User table yet)
    await prisma.pendingUser.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        studentClass: studentClass || null,
        section: section || null,
        roll: roll || null,
        code,
        expiresAt,
      },
    });

    // 5. Send email (gracefully degrades to console log in dev)
    try {
      await sendVerificationEmail(normalizedEmail, code, name);
    } catch (emailErr) {
      console.error("⚠️  Verification email send failed:", emailErr);
    }

    return NextResponse.json(
      {
        message: "Verify your email to complete registration.",
        requiresVerification: true,
        email: normalizedEmail,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}
