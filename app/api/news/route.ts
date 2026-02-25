import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const news = await prisma.news.findMany({
            include: {
                author: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, content, imageUrl } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newsItem = await prisma.news.create({
            data: {
                title,
                content,
                imageUrl,
                authorId: session.user.id
            }
        });

        return NextResponse.json(newsItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
    }
}
