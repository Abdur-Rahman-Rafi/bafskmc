import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.gallery.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { title, imageUrl, category, date } = body;

        const updated = await prisma.gallery.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(imageUrl && { imageUrl }),
                ...(category && { category }),
                ...(date && { date: new Date(date) }),
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
    }
}
