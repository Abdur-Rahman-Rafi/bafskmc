import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Public: get a config value by key
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    try {
        if (key) {
            const config = await prisma.siteConfig.findUnique({ where: { key } });
            return NextResponse.json(config ?? { key, value: null });
        }
        const all = await prisma.siteConfig.findMany();
        return NextResponse.json(all);
    } catch {
        return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
    }
}

// Admin only: upsert a config value
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { key, value } = await req.json();
        const config = await prisma.siteConfig.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
        return NextResponse.json(config);
    } catch {
        return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
    }
}
