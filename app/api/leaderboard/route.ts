import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {
                role: "STUDENT"
            },
            select: {
                id: true,
                name: true,
                image: true,
                class: true,
                roll: true,
                achievements: {
                    select: {
                        points: true
                    }
                }
            }
        });

        const leaderboard = users.map(u => ({
            id: u.id,
            name: u.name,
            image: u.image,
            class: u.class,
            roll: u.roll,
            totalPoints: u.achievements.reduce((acc, curr) => acc + (curr.points || 0), 0)
        })).sort((a, b) => b.totalPoints - a.totalPoints);

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
