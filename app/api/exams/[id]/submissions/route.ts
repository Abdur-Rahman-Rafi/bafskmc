import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all submissions for an exam (admin only)
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const submissions = await prisma.submission.findMany({
            where: { examId: id },
            include: {
                student: {
                    select: { id: true, name: true, email: true, class: true, roll: true, image: true }
                }
            },
            orderBy: { submittedAt: "desc" }
        });

        return NextResponse.json(submissions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
    }
}

// PATCH - admin grades a submission → auto-updates leaderboard via Achievement
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: examId } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { submissionId, score, feedback } = await req.json();

        if (score === undefined || score === null) {
            return NextResponse.json({ error: "Score is required" }, { status: 400 });
        }

        const numericScore = parseFloat(score);

        // Fetch submission + exam name
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: { exam: { select: { name: true } } }
        });

        if (!submission) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        // Update submission with score + feedback
        const updated = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                score: numericScore,
                feedback: feedback || null,
                markedBy: session.user.id
            }
        });

        // Auto-update leaderboard: remove old achievement for this exam if exists, then create new
        await prisma.achievement.deleteMany({
            where: {
                userId: submission.studentId,
                title: { contains: submission.exam.name }
            }
        });

        if (numericScore > 0) {
            await prisma.achievement.create({
                data: {
                    title: `${submission.exam.name}`,
                    description: `Scored ${numericScore} marks in ${submission.exam.name}. ${feedback || ""}`.trim(),
                    points: Math.round(numericScore),
                    userId: submission.studentId
                }
            });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Grading error:", error);
        return NextResponse.json({ error: "Failed to grade submission" }, { status: 500 });
    }
}
