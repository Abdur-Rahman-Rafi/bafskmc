import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all gallery items
export async function GET() {
    try {
        const gallery = await prisma.gallery.findMany({
            orderBy: { date: "desc" }
        });
        return NextResponse.json(gallery);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
    }
}

// POST new gallery item (Admin only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, imageUrl, category, date } = body;

        if (!title || !imageUrl) {
            return NextResponse.json({ error: "Title and Image URL are required" }, { status: 400 });
        }

        const item = await prisma.gallery.create({
            data: {
                title,
                imageUrl,
                category: category || "General",
                date: date ? new Date(date) : new Date(),
            }
        });

        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
    }
}
