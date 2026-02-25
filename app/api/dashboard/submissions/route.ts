import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const submissions = await prisma.submission.findMany({
            where: { studentId: session.user.id },
            include: {
                exam: {
                    select: {
                        name: true,
                        startTime: true,
                        endTime: true
                    }
                }
            },
            orderBy: { submittedAt: "desc" }
        });

        return NextResponse.json(submissions);
    } catch (error) {
        console.error("Submissions fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
    }
}
