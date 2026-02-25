import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - admin verifies or rejects a payment
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await req.json();

        if (!["VERIFIED", "REJECTED"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const payment = await prisma.payment.update({
            where: { id },
            data: {
                status,
                verifiedAt: new Date(),
                verifiedBy: session.user.id,
            }
        });

        // If verified, we can also update the user's paymentStatus if they have a link
        if (status === "VERIFIED") {
            await prisma.user.update({
                where: { id: payment.userId },
                data: { paymentStatus: "VERIFIED" }
            });
        }

        return NextResponse.json(payment);
    } catch (error) {
        console.error("Error updating payment:", error);
        return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
    }
}

// DELETE - admin deletes a payment record
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await prisma.payment.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
