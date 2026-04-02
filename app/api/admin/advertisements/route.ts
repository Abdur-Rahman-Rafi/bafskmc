import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const ads = await prisma.advertisement.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(ads);
    } catch (err: any) {
        return NextResponse.json({ error: "Failed to fetch advertisements" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { companyName, imageUrl, targetUrl, type, isActive } = await req.json();

        if (!companyName || !imageUrl) {
            return NextResponse.json({ error: "Company name and image are required." }, { status: 400 });
        }

        const newAd = await prisma.advertisement.create({
            data: {
                companyName,
                imageUrl,
                targetUrl: targetUrl || null,
                type: type || "UNPAID",
                isActive: isActive ?? true,
            }
        });

        return NextResponse.json(newAd);
    } catch (err: any) {
        console.error("CREATE AD ERROR:", err);
        return NextResponse.json({ error: "Failed to create advertisement", details: err.message }, { status: 500 });
    }
}
