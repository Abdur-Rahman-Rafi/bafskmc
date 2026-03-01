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
        const news = await prisma.news.findUnique({
            where: { id },
            include: { author: { select: { name: true } } }
        });
        if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.news.delete({ where: { id } });
        return NextResponse.json({ message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { title, content, imageUrl, fileUrl, type } = await req.json();
        const news = await prisma.news.update({
            where: { id },
            data: { title, content, imageUrl, fileUrl, type }
        });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
