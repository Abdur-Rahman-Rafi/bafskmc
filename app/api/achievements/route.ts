import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const achievements = await prisma.achievement.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { dateAwarded: "desc" }
        });
        return NextResponse.json(achievements);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const achievement = await prisma.achievement.create({
            data: {
                title: data.title,
                description: data.description,
                badgeUrl: data.badgeUrl,
                userId: data.userId,
                points: Number(data.points) || 0
            }
        });

        // Trigger Notification
        if (data.userId) {
            await prisma.notification.create({
                data: {
                    userId: data.userId,
                    title: "🏆 New Honor Awarded!",
                    message: `You've been decorated with the honor: ${data.title}. +${data.points} XP added to your profile.`,
                    type: "SUCCESS",
                    link: "/dashboard/results"
                }
            });
        }

        return NextResponse.json(achievement, { status: 201 });
    } catch (error) {
        console.error("Achievement creation error:", error);
        return NextResponse.json({ error: "Failed to award badge" }, { status: 500 });
    }
}
