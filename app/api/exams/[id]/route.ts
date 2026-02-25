import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const exam = await prisma.exam.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { submissions: true }
                }
            }
        });
        if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        return NextResponse.json(exam);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch exam" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description, regStartTime, regEndTime, startTime, endTime, duration, questionFileUrl, questions } = await req.json();
        const exam = await prisma.exam.update({
            where: { id },
            data: {
                name,
                description,
                regStartTime: new Date(regStartTime),
                regEndTime: new Date(regEndTime),
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                duration: parseInt(duration),
                questionFileUrl,
                questions
            }
        });

        return NextResponse.json(exam);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update exam" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.registration.deleteMany({ where: { examId: id } });
        await prisma.submission.deleteMany({ where: { examId: id } });
        await prisma.exam.delete({ where: { id } });

        return NextResponse.json({ message: "Exam and associated data purged" });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Failed to delete exam" }, { status: 500 });
    }
}
