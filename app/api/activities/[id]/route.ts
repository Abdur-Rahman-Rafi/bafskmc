import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const activity = await prisma.activity.findUnique({
            where: { id },
            include: {
                creator: { select: { name: true } }
            }
        });

        if (!activity) {
            return NextResponse.json({ error: "Activity not found" }, { status: 404 });
        }

        return NextResponse.json(activity);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
    }
}

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
        const activity = await prisma.activity.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                category: data.category,
                date: data.date ? new Date(data.date) : undefined,
                location: data.location,
                coverUrl: data.coverUrl,
                files: data.files
            }
        });

        return NextResponse.json(activity);
    } catch (error: any) {
        console.error("Activity update error:", error);
        return NextResponse.json({
            error: "Failed to update activity",
            details: error.message,
            code: error.code
        }, { status: 500 });
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

        await prisma.activity.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Activity deleted" });
    } catch (error: any) {
        console.error("Activity delete error:", error);
        return NextResponse.json({
            error: "Failed to delete activity",
            details: error.message,
            code: error.code
        }, { status: 500 });
    }
}
