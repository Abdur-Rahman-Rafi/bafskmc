import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET current user profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                class: true,
                section: true,
                roll: true,
                experience: true,
                hasLoggedInBefore: true,
                role: true,
                paymentStatus: true,
                createdAt: true,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

// PATCH update profile
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, studentClass, section, roll, experience, image } = body;

        const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(name && { name }),
                ...(phone && { phone }),
                ...(studentClass !== undefined && { class: studentClass }),
                ...(section !== undefined && { section }),
                ...(roll !== undefined && { roll }),
                ...(experience !== undefined && { experience }),
                ...(image !== undefined && { image }),
            },
            select: {
                id: true, name: true, email: true, image: true,
                phone: true, class: true, section: true, roll: true,
                experience: true,
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
