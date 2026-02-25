import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    try {
        const users = await prisma.user.findMany({
            where: status ? { paymentStatus: status as any } : {},
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                phone: true,
                class: true,
                roll: true,
                transactionId: true,
                paymentStatus: true
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
