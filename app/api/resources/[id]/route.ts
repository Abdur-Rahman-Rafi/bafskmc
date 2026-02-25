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
        const resource = await prisma.resource.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                fileUrl: data.fileUrl,
                category: data.category
            }
        });

        return NextResponse.json(resource);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
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

        await prisma.resource.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Resource deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
    }
}
