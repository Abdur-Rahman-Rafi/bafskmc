import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId, status } = await req.json();

        if (!userId || !["VERIFIED", "REJECTED"].includes(status)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { paymentStatus: status },
        });

        return NextResponse.json({
            message: `Membership ${status === "VERIFIED" ? "Approved" : "Rejected"} successfully.`,
            user
        });
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ error: "Failed to update verification status" }, { status: 500 });
    }
}
