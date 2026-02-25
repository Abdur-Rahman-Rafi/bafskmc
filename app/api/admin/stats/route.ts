import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [userCount, examCount, newsCount, achievementCount, pendingPayments] = await Promise.all([
            prisma.user.count({ where: { role: "STUDENT" } }),
            prisma.exam.count(),
            prisma.news.count(),
            prisma.achievement.count(),
            // Count from the NEW Payment model
            prisma.payment.count({ where: { status: "PENDING" } })
        ]);

        return NextResponse.json({
            stats: {
                totalStudents: userCount,
                activeExams: examCount,
                newsPosts: newsCount,
                achievements: achievementCount,
                pendingPayments
            }
        });
    } catch (error) {
        console.error("Admin stats fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
    }
}
