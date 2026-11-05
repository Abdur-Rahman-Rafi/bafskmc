# Security & DoS / DDoS Mitigation Architecture

This document describes the multi-layered security controls implemented in **BAFSK Math Club** and recommendations for production deployments.

---

## 1. Implemented Application Layer Defenses (Layer 7)

### A. Next.js Edge Middleware (`middleware.ts`)
1. **Malicious Bot & Scanner Blocking**:
   - Inspects incoming `User-Agent` headers for recognized vulnerability and penetration scanners (`sqlmap`, `nikto`, `wpscan`, `gobuster`, `dirbuster`, `acunetix`, etc.).
   - Responds immediately with `403 Forbidden` before any compute or database operations trigger.
2. **Multi-Tier Sliding Window Rate Limiting**:
   - **Sensitive Auth Routes** (`/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password`):
     - Maximum 15 requests per 15 minutes per IP.
     - Defends against **SMTP mail bombing**, **bcrypt CPU exhaustion**, and **OTP brute-force**.
   - **API Mutations** (`POST\,, `PUT`, `DELETE`, `PATCH`):
     - Maximum 60 requests per minute per IP.
     - Prevents high-frequency DB write flooding and storage exhaustion.
   - **API Reads** (`GET`, `HEAD`, `OPTIONS`):
     - Maximum 180 requests per minute per IP.
     - Protects against scraping and database query resource exhaustion.
3. **Route Authorization Guard**:
   - Centralized authentication check enforcing JWT presence on `/dashboard/*`, `/exams/*`, and `/admin/*`.
   - Non-admin users attempting to access `/admin/*` are safely redirected.

### B. Route-Level Defense-in-Depth
- In addition to middleware, critical auth handlers (`/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password`) independently verify IP rate limits and return standardized `429 Too Many Requests` with RFC-compliant headers (`Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`).

### C. Hardened HTTP Security Headers (`next.config.ts`)JThe application automatically attaches the following headers to all responses:
- **X-Frame-Options: DENY**: Prevents clickjacking by disabling embedding inside external iframes.
- **X-Content-Type-Options: nosniff**: Prevents MIME-sniffing attacks.
-&�+Strict-Transport-Security (HSTS)**: `max-age=63072000; includeSubDomains; preload` enforces HTTPS exclusively.
- **X-XSS-Protection: 1; mode=block**: Activates legacy browser XSS filters.
-&�*Referrer-Policy: strict-origin-when-cross-origin**: Prevents leaking sensitive URL query parameters across origins.
-&�*Permissions-Policy**: Restricts access to device capabilities (camera, microphone, geolocation).
- **poweredByHeader: false**: Strips `X-Powered-By: Next.js` to avoid software fingerprinting.

---

## 2. Infrastructure & Volumetric DDoS Recommendations (Layers 3, 4, and 7)

Application code can mitigate Layer 7 application abuse, but large-scale volumetric attacks (e.g. 10Gbps-100Gbps SYN floods, UDP floods, or distributed botnets) must be mitigated upstream before network packets reach the application server.

### 1. Cloudflare / CDN Integration (Highly Recommended)
- Place Cloudflare in front of your domain:
   - **Proxied DNS (Orange Cloud)**: Hides the origin server's direct IP address.
   - **Under Attack Mode**: Can be toggled instantly during active DDoS attacks to require Managed Challenges (Turnstile/CAPTCHA).
   - **Cloudflare WAF**: Automatically drops known botnets, Layer 3/4 floods, and Layer 7 HTTP flood attacks.
   - **Rate Limiting Rules**: Can enforce edge-level rate limits even before Next.js receives the request.

---

## 3. Maintenance & Monitoring
- All rate-limiting memory stores automatically purge stale IP records every 5 minutes to avoid memory leaks.
- For high-availability multi-instance deployments (e.g., clustered Docker or multi-region serverless), configure Redis / Upstash as the shared rate limit backend.
