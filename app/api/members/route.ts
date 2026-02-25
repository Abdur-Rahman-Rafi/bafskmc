import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // PANEL or ALUMNI

        const members = await prisma.member.findMany({
            where: type ? { type: type as "PANEL" | "ALUMNI" } : undefined,
            orderBy: { priority: "asc" }
        });
        return NextResponse.json(members);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        if (!data.name || !data.position) {
            return NextResponse.json({ error: "Name and Position are required" }, { status: 400 });
        }

        const member = await prisma.member.create({
            data: {
                name: data.name,
                position: data.position,
                image: data.image || null,
                priority: parseInt(data.priority) || 100,
                fbId: data.fbId || null,
                type: data.type, // PANEL or ALUMNI
                bio: data.bio || null,
                session: data.session || null,
            }
        });

        return NextResponse.json(member, { status: 201 });
    } catch (error) {
        console.error("Member creation error:", error);
        return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
    }
}
