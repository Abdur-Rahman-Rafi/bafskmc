import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
        const { role } = await req.json();

        if (role !== "ADMIN" && role !== "STUDENT") {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role }
        });

        return NextResponse.json({ message: "Role updated", role: user.role });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
    }
}
