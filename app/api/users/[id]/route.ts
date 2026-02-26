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

        // Fetch user email first (needed to clean password reset tokens)
        const user = await prisma.user.findUnique({
            where: { id },
            select: { email: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Delete all related records first, then the user — in a transaction
        await prisma.$transaction(async (tx) => {
            await tx.achievement.deleteMany({ where: { userId: id } });
            await tx.submission.deleteMany({ where: { userId: id } });
            await tx.payment.deleteMany({ where: { userId: id } });
            await tx.registration.deleteMany({ where: { userId: id } });
            await tx.passwordResetToken.deleteMany({ where: { email: user.email } });
            await tx.activity.deleteMany({ where: { creatorId: id } });
            await tx.resource.deleteMany({ where: { creatorId: id } });
            await tx.exam.deleteMany({ where: { creatorId: id } });
            await tx.news.deleteMany({ where: { authorId: id } });
            await tx.user.delete({ where: { id } });
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("User delete error:", error);
        return NextResponse.json({
            error: "Failed to delete user",
            details: error.message
        }, { status: 500 });
    }
}
