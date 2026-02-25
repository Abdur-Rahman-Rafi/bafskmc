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

        const exam = await prisma.exam.findUnique({
            where: { id },
            select: { regStartTime: true, regEndTime: true }
        });

        if (!exam) {
            return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        }

        const now = new Date();
        if (now < exam.regStartTime || now > exam.regEndTime) {
            return NextResponse.json({ error: "Registration is not active" }, { status: 403 });
        }

        const registration = await prisma.registration.upsert({
            where: {
                examId_studentId: {
                    examId: id,
                    studentId: session.user.id
                }
            },
            update: {},
            create: {
                examId: id,
                studentId: session.user.id
            }
        });

        return NextResponse.json(registration);
    } catch (error) {
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
