import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId, newTotalPoints } = await req.json();

        // 1. Calculate current points
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { achievements: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const currentPoints = user.achievements.reduce((acc, curr) => acc + (curr.points || 0), 0);
        const difference = newTotalPoints - currentPoints;

        if (difference === 0) {
            return NextResponse.json({ success: true, message: "No change needed" });
        }

        // 2. Create an achievement representing the rating adjustment
        await prisma.achievement.create({
            data: {
                title: "Official Rating Adjustment",
                description: `Manual adjustment by admin. Previous points: ${currentPoints}, New points: ${newTotalPoints}.`,
                points: difference,
                userId: userId,
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to adjust points:", error);
        return NextResponse.json({ error: "Failed to adjust points" }, { status: 500 });
    }
}
