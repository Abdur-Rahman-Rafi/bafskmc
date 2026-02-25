import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH - update announcement for an exam
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { announcement } = await req.json();

        const exam = await prisma.exam.update({
            where: { id },
            data: { announcement }
        });

        return NextResponse.json(exam);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
    }
}
