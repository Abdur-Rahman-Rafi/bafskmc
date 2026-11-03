import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALERT_CONFIG_KEY = "home_highlight_alert";

const DEFAULT_ALERT = {
    enabled: true,
    type: "COMPETITION",
    badge: "NEW COMPETITION",
    title: "National Math Olympiad 2026 — Registration Now Open!",
    description: "Prepare your analytical skills and represent BAFSKMC at the upcoming nationwide championship.",
    link: "/news",
    buttonText: "Learn & Register",
    theme: "gold" // gold, cyan, crimson
};

// Public GET: returns the current highlight alert config
export async function GET() {
    try {
        const config = await prisma.siteConfig.findUnique({
            where: { key: ALERT_CONFIG_KEY }
        });

        if (!config || !config.value) {
            return NextResponse.json(DEFAULT_ALERT);
        }

        try {
            const parsed = JSON.parse(config.value);
            return NextResponse.json(parsed);
        } catch {
            return NextResponse.json(DEFAULT_ALERT);
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch alert config" }, { status: 500 });
    }
}

// Admin POST: updates the highlight alert config
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        const config = await prisma.siteConfig.upsert({
            where: { key: ALERT_CONFIG_KEY },
            update: { value: JSON.stringify(data) },
            create: { key: ALERT_CONFIG_KEY, value: JSON.stringify(data) },
        });

        return NextResponse.json({ success: true, alert: data });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save alert config" }, { status: 500 });
    }
}
