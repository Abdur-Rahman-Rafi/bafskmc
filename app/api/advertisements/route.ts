import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const ads = await prisma.advertisement.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(ads);
    } catch (err: any) {
        return NextResponse.json({ error: "Failed to fetch advertisements" }, { status: 500 });
    }
}
