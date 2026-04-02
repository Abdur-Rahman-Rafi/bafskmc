import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        const data = await req.json();

        // Update fields provided (status, vivaTime, vivaLink)
        const updateData: any = {};
        if (data.status !== undefined) updateData.status = data.status;
        if (data.vivaTime !== undefined) updateData.vivaTime = data.vivaTime ? new Date(data.vivaTime) : null;
        if (data.vivaLink !== undefined) updateData.vivaLink = data.vivaLink;

        const application = await prisma.panelApplication.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(application);
    } catch (err: any) {
        console.error("Error updating application:", err);
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }
}
