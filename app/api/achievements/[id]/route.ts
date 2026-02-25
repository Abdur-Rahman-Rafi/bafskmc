import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const achievement = await prisma.achievement.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                badgeUrl: data.badgeUrl,
                userId: data.userId,
                points: Number(data.points) || 0
            }
        });

        return NextResponse.json(achievement);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.achievement.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Achievement revoked" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
    }
}
