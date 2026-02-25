import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const activities = await prisma.activity.findMany({
            include: {
                creator: { select: { name: true } }
            },
            orderBy: { date: "desc" }
        });
        return NextResponse.json(activities);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    console.log("Activity POST Session:", session);

    if (!session || session.user.role !== "ADMIN") {
        console.log("Unauthorized attempt to post activity");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        console.log("Activity POST Body:", body);
        const { title, description, category, date, location, coverUrl, files } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        // Verify user exists to avoid foreign key failure
        const userExists = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!userExists) {
            console.error("Session user ID not found in database:", session.user.id);
            return NextResponse.json({ error: "User session is invalid. Please log out and log in again." }, { status: 401 });
        }

        const activity = await prisma.activity.create({
            data: {
                title,
                description: description || null,
                category: category || "Event",
                date: date ? new Date(date) : new Date(),
                location: location || null,
                coverUrl: coverUrl || null,
                files: files || [],
                creatorId: session.user.id
            }
        });

        console.log("Activity created successfully:", activity.id);
        return NextResponse.json(activity, { status: 201 });
    } catch (error: any) {
        console.error("Activity create error detail:", error);
        return NextResponse.json({
            error: "Failed to create activity",
            details: error.message,
            code: error.code,
            meta: error.meta
        }, { status: 500 });
    }
}
