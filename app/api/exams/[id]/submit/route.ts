import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { submissionFileUrl, answers } = await req.json();

        // Check if student is registered
        const registration = await prisma.registration.findUnique({
            where: {
                examId_studentId: {
                    examId: id,
                    studentId: session.user.id
                }
            }
        });

        if (!registration) {
            return NextResponse.json({ error: "Registration record not found for this protocol" }, { status: 403 });
        }

        const exam = await prisma.exam.findUnique({
            where: { id },
            select: { startTime: true, endTime: true, name: true }
        });

        if (!exam) {
            return NextResponse.json({ error: "Trial protocol not found" }, { status: 404 });
        }

        const now = new Date();
        // Allow a small grace period (5 mins) for submission after endTime
        const graceEndTime = new Date(exam.endTime.getTime() + 5 * 60000);

        if (now < exam.startTime || now > graceEndTime) {
            return NextResponse.json({ error: "Temporal window for submission is closed" }, { status: 403 });
        }

        // Check for existing submission
        const existing = await prisma.submission.findFirst({
            where: { examId: id, studentId: session.user.id }
        });

        if (existing) {
            return NextResponse.json({ error: "Data already committed for this trial" }, { status: 400 });
        }

        const submission = await prisma.submission.create({
            data: {
                examId: id,
                studentId: session.user.id,
                answers, // Optional, for structure
                submissionFileUrl,
                score: null // Manual grading pending
            }
        });

        return NextResponse.json(submission);
    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json({ error: "Protocol commitment failed" }, { status: 500 });
    }
}
