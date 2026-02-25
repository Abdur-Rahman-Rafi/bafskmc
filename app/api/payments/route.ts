import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - get payments (admin: all, student: own)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MODERATOR";
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const where: any = isAdmin
            ? status ? { status } : {}
            : { userId: session.user.id };

        const payments = await prisma.payment.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true, class: true, roll: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
    }
}

// POST - student submits payment
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { amount, note, method, transactionId } = await req.json();

        if (!amount || !note) {
            return NextResponse.json({ error: "Amount and note are required" }, { status: 400 });
        }

        const payment = await prisma.payment.create({
            data: {
                userId: session.user.id,
                amount: parseFloat(amount),
                note,
                method: method || "bKash",
                transactionId: transactionId || null,
                status: "PENDING",
            }
        });

        return NextResponse.json(payment, { status: 201 });
    } catch (error) {
        console.error("Error creating payment:", error);
        return NextResponse.json({ error: "Failed to submit payment" }, { status: 500 });
    }
}
