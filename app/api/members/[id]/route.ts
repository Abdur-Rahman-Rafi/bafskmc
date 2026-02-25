import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const member = await prisma.member.findUnique({
            where: { id }
        });

        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        return NextResponse.json(member);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();

        const member = await prisma.member.update({
            where: { id },
            data: {
                name: data.name,
                position: data.position,
                image: data.image,
                priority: parseInt(data.priority) || 100,
                fbId: data.fbId,
                type: data.type,
                bio: data.bio,
                session: data.session
            }
        });

        return NextResponse.json(member);
    } catch (error) {
        console.error("Member update error:", error);
        return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await prisma.member.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Member deleted successfully" });
    } catch (error) {
        console.error("Member deletion error:", error);
        return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
    }
}
