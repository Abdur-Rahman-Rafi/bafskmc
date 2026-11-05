import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

// Suspicious/scanner User-Agent patterns
const BLOCKED_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /acunetix/i,
  /masscan/i,
  /zgrab/i,
  /nmap/i,
  /dirbuster/i,
  /gobuster/i,
  /wpscan/i,
];

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userAgent = req.headers.get("user-agent") || "";
  const ip = getClientIp(req);

  // 1. Block automated scanning tools & malicious bot signatures
  for (const pattern of BLOCKED_USER_AGENTS) {
    if (pattern.test(userAgent)) {
      return new NextResponse("Forbidden: Malicious activity detected.", {
        status: 403,
      });
    }
  }

  // 2. Multi-tier API Rate Limiting to prevent DoS / DDoS / Credential Stuffing
  if (pathname.startsWith("/api/")) {
    const isAuthRoute =
      pathname.startsWith("/api/auth/register") ||
      pathname.startsWith("/api/auth/forgot-password") ||
      pathname.startsWith("/api/auth/reset-password");

    if (isAuthRoute) {
      // Strict tier for sensitive auth endpoints: 15 requests per 15 minutes per IP (defendss SMTP bombing & bcrypt hashing DoS)
      const authLimit = checkRateLimit(`auth:${ip}`, {
        limit: 15,
        windowMs: 15 * 60 * 1000,
      });

      if (!authLimit.success) {
        return rateLimitResponse(authLimit);
      }
    } else {
      // General API rate limit:
      // Mutations (POST, PUT, DELETE, PATCH): 60 req/min
      // Reads (GET, HEAD, OPTIONS): 180 req/min
      const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(req.method);
      const limit = isMutation ? 60 : 180;
      const windowMs = 60 * 1000;

      const apiLimit = checkRateLimit(`api:${isMutation ? "mut:" : "read:"}${ip}`, {
        limit,
        windowMs,
      });

      if (!apiLimit.success) {
        return rateLimitResponse(apiLimit);
      }
    }
  }

  // 3. Route Access Authorization
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/exams");

  if (isProtectedPage) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/exams/:path*",
  ],
};
