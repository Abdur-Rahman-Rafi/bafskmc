import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        const exams = await prisma.exam.findMany({
            orderBy: { startTime: "desc" },
            include: {
                _count: {
                    select: { submissions: true }
                },
                registrations: userId ? {
                    where: { studentId: userId }
                } : undefined,
                submissions: userId ? {
                    where: { studentId: userId }
                } : undefined
            }
        });
        return NextResponse.json(exams);
    } catch (error) {
        console.error("Exam fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, description, regStartTime, regEndTime, startTime, endTime, duration, questionFileUrl, questions } = await req.json();

        const exam = await prisma.exam.create({
            data: {
                name,
                description,
                regStartTime: new Date(regStartTime),
                regEndTime: new Date(regEndTime),
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                duration: parseInt(duration),
                questionFileUrl,
                questions, // Still keeping it for legacy or if they use both
                creatorId: session.user.id
            }
        });

        return NextResponse.json(exam, { status: 201 });
    } catch (error) {
        console.error("Exam creation error:", error);
        return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
    }
}
