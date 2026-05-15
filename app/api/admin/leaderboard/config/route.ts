import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const config = await prisma.siteConfig.findUnique({
            where: { key: "leaderboard_visible" }
        });
        return NextResponse.json({ visible: config ? config.value === "true" : true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { visible } = await req.json();
        
        await prisma.siteConfig.upsert({
            where: { key: "leaderboard_visible" },
            update: { value: visible ? "true" : "false" },
            create: { key: "leaderboard_visible", value: visible ? "true" : "false" }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
    }
}
