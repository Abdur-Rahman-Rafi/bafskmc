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

        // Fetch user first to confirm existence and get email
        const user = await prisma.user.findUnique({
            where: { id },
            select: { email: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Delete related records using the correct field names from schema
        await prisma.$transaction(async (tx) => {
            // Submission uses `studentId`
            await tx.submission.deleteMany({ where: { studentId: id } });
            // Registration uses `studentId`
            await tx.registration.deleteMany({ where: { studentId: id } });
            // Achievement uses `userId`
            await tx.achievement.deleteMany({ where: { userId: id } });
            // Payment uses `userId`
            await tx.payment.deleteMany({ where: { userId: id } });
            // PasswordResetToken uses `email`
            await tx.passwordResetToken.deleteMany({ where: { email: user.email } });
            // Activity uses `creatorId`
            await tx.activity.deleteMany({ where: { creatorId: id } });
            // Resource uses `creatorId`
            await tx.resource.deleteMany({ where: { creatorId: id } });
            // Competition uses `creatorId`
            await tx.competition.deleteMany({ where: { creatorId: id } });
            // Exam uses `creatorId` — delete its registrations/submissions first
            const exams = await tx.exam.findMany({ where: { creatorId: id }, select: { id: true } });
            const examIds = exams.map(e => e.id);
            if (examIds.length > 0) {
                await tx.submission.deleteMany({ where: { examId: { in: examIds } } });
                await tx.registration.deleteMany({ where: { examId: { in: examIds } } });
                await tx.exam.deleteMany({ where: { creatorId: id } });
            }
            // News uses `authorId`
            await tx.news.deleteMany({ where: { authorId: id } });
            // Finally delete the user
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
