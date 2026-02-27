import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

async function sendResetEmail(to: string, resetUrl: string, name?: string) {
  // If SMTP is not configured, log the URL to the console (handy for development)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧  PASSWORD RESET LINK (dev mode)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`To:  ${to}`);
    console.log(`URL: ${resetUrl}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return;
  }

  // Dynamic import so the module doesn't crash at startup if nodemailer isn't needed
  const nodemailer = (await import("nodemailer")).default;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const displayName = name || "Mathlete";

  const fromAddress = process.env.SMTP_FROM || "noreply@bafskmc.com";

  await transporter.sendMail({
    from: `"BAFSK Math Club" <${fromAddress}>`,
    to,
    subject: "Reset Your Password — BAFSK Math Club",
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
            <div style="font-size:24px;font-weight:900;color:#fff;letter-spacing:-0.5px;margin-bottom:12px;">Reset Your Password</div>
            <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.7;margin:0 0 32px;">
              Hey <strong style="color:#fff;">${displayName}</strong>, we received a request to reset your BAFSK Math Club account password. Click the button below to initialize the recovery protocol.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:0 0 32px;">
                <a href="${resetUrl}" style="display:inline-block;background:#C9A84C;color:#000;font-weight:900;font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:20px 48px;border-radius:18px;box-shadow:0 10px 30px rgba(201,168,76,0.2);">
                  Reset Password
                </a>
              </td></tr>
            </table>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:20px;text-align:center;">
              <p style="color:rgba(255,255,255,0.3);font-size:12px;line-height:1.6;margin:0;">
                ⏱ Security link expires in <strong style="color:rgba(255,255,255,0.5);">1 hour</strong>.
              </p>
            </div>
            <p style="color:rgba(255,255,255,0.15);font-size:10px;margin:28px 0 0;line-height:1.6;text-align:center;word-break:break-all;">
              If the button doesn't work, copy this link:<br>
              <a href="${resetUrl}" style="color:rgba(201,168,76,0.5);text-decoration:none;">${resetUrl}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.05);padding:24px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.1);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">BAFSK Math Club System Presence</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim(),
  });
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Always return the same response to prevent email enumeration
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true }
    });

    if (user) {
      // Delete any existing tokens for this email
      await prisma.passwordResetToken.deleteMany({
        where: { email: user.email }
      });

      // Generate a secure random token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store the token
      await prisma.passwordResetToken.create({
        data: { token, email: user.email, expiresAt }
      });

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      // Send email — gracefully degrades to console log if SMTP not configured
      try {
        await sendResetEmail(user.email, resetUrl, user.name || undefined);
      } catch (emailErr) {
        // Log the error but don't expose it to the client
        console.error("⚠️  Email send failed:", emailErr);
        console.log(`📋  Reset URL for ${user.email}: ${resetUrl}`);
      }
    }

    return NextResponse.json({
      message: "If an account with that email exists, a reset link has been sent."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    );
  }
}
