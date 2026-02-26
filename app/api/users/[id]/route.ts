import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        // Prevent deleting yourself
        if (id === session.user.id) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        // Delete all related records first to avoid foreign key errors
        await prisma.$transaction([
            prisma.achievement.deleteMany({ where: { userId: id } }),
            prisma.submission.deleteMany({ where: { userId: id } }),
            prisma.payment.deleteMany({ where: { userId: id } }),
            prisma.registration.deleteMany({ where: { userId: id } }),
            prisma.passwordResetToken.deleteMany({ where: { email: (await prisma.user.findUnique({ where: { id }, select: { email: true } }))?.email || "" } }),
            prisma.activity.deleteMany({ where: { creatorId: id } }),
            prisma.resource.deleteMany({ where: { creatorId: id } }),
            prisma.exam.deleteMany({ where: { creatorId: id } }),
            prisma.news.deleteMany({ where: { authorId: id } }),
            prisma.user.delete({ where: { id } }),
        ]);

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("User delete error:", error);
        return NextResponse.json({ error: "Failed to delete user", details: error.message }, { status: 500 });
    }
}
