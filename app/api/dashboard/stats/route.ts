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

        const userId = session.user.id;

        // 1. Get total points from achievements
        const achievementData = await prisma.achievement.aggregate({
            where: { userId },
            _sum: { points: true }
        });
        const totalPoints = achievementData._sum.points || 0;

        // 2. Get total exams taken (submissions)
        const totalExams = await prisma.submission.count({
            where: { studentId: userId }
        });

        // 3. Get rank (simplified: current user position vs others based on points)
        // Note: For a real production app, you might want a more efficient way to calculate rank
        const allUsersPoints = await prisma.user.findMany({
            select: {
                id: true,
                achievements: {
                    select: { points: true }
                }
            }
        });

        const rankedUsers = allUsersPoints.map(u => ({
            id: u.id,
            total: u.achievements.reduce((acc, curr) => acc + (curr.points || 0), 0)
        })).sort((a, b) => b.total - a.total);

        const currentRank = rankedUsers.findIndex(u => u.id === userId) + 1;
        const totalUsers = rankedUsers.length;

        // 4. Recent activities (top 5 combined submissions and awards)
        const [submissions, achievements] = await Promise.all([
            prisma.submission.findMany({
                where: { studentId: userId },
                include: { exam: { select: { name: true } } },
                orderBy: { submittedAt: "desc" },
                take: 5
            }),
            prisma.achievement.findMany({
                where: { userId },
                orderBy: { dateAwarded: "desc" },
                take: 5
            })
        ]);

        const activities = [
            ...submissions.map(s => ({
                id: s.id,
                title: s.exam.name,
                date: s.submittedAt,
                type: "Exam",
                score: s.score ? `${Math.round(s.score)}/100` : null
            })),
            ...achievements.map(a => ({
                id: a.id,
                title: a.title,
                date: a.dateAwarded,
                type: "Badge",
                score: a.points ? `+${a.points} XP` : null
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

        return NextResponse.json({
            stats: {
                totalPoints,
                totalExams,
                rank: `#${currentRank}`,
                percentile: totalUsers > 0 ? `Top ${Math.max(1, Math.round((currentRank / totalUsers) * 100))}%` : "100%"
            },
            activities
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
