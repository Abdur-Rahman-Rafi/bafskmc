import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const resources = await prisma.resource.findMany({
            include: {
                creator: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(resources);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, description, fileUrl, imageUrl, category } = await req.json();

        if (!title || !fileUrl || !category) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const resource = await prisma.resource.create({
            data: {
                title,
                description,
                fileUrl,
                imageUrl,
                category,
                creatorId: session.user.id
            }
        });

        return NextResponse.json(resource, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
    }
}
