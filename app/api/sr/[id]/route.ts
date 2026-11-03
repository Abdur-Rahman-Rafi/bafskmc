import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getSRList, saveSRList, SectionRep } from "../route";

export const dynamic = "force-dynamic";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const list = await getSRList();
        const sr = list.find((item) => item.id === id);

        if (!sr) {
            return NextResponse.json({ error: "SR not found" }, { status: 404 });
        }

        return NextResponse.json(sr, {
            headers: { "Cache-Control": "no-store, max-age=0" }
        });
    } catch (error) {
        console.error("GET SR by ID error:", error);
        return NextResponse.json({ error: "Failed to retrieve SR" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const role = session?.user?.role?.toUpperCase();
        if (!session || (role !== "ADMIN" && role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        const list = await getSRList();
        const index = list.findIndex((item) => item.id === id);

        if (index === -1) {
            return NextResponse.json({ error: "SR not found" }, { status: 404 });
        }

        list[index] = {
            ...list[index],
            name: body.name ? body.name.trim() : list[index].name,
            class: body.class ? body.class.trim() : list[index].class,
            section: body.section ? body.section.trim() : list[index].section,
            image: body.image !== undefined ? body.image : list[index].image,
            priority: body.priority !== undefined ? parseInt(body.priority, 10) : list[index].priority,
            fbId: body.fbId !== undefined ? body.fbId : list[index].fbId,
        };

        await saveSRList(list);

        return NextResponse.json(list[index]);
    } catch (error) {
        console.error("PUT SR error:", error);
        return NextResponse.json({ error: "Failed to update SR" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const role = session?.user?.role?.toUpperCase();
        if (!session || (role !== "ADMIN" && role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const list = await getSRList();
        const filtered = list.filter((item) => item.id !== id);

        await saveSRList(filtered);

        return NextResponse.json({ success: true, deletedId: id });
    } catch (error) {
        console.error("DELETE SR error:", error);
        return NextResponse.json({ error: "Failed to delete SR" }, { status: 500 });
    }
}
