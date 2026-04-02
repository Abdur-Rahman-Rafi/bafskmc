import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const application = await prisma.panelApplication.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                status: true,
                vivaTime: true,
                vivaLink: true,
            }
        });

        if (!application) {
            return NextResponse.json({ error: "No application found with this email" }, { status: 404 });
        }

        return NextResponse.json(application);
    } catch (error: any) {
        console.error("Error fetching application status:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
