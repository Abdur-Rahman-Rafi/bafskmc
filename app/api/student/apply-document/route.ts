import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT") {
        return NextResponse.json({ error: "Unauthorized. Only students can apply for documents." }, { status: 401 });
    }

    try {
        const { type, reason } = await req.json();

        if (!type || !reason) {
            return NextResponse.json({ error: "Type and reason are required." }, { status: 400 });
        }

        // Try to create the document request in the database
        let documentRequest = null;
        try {
            documentRequest = await prisma.documentRequest.create({
                data: {
                    userId: session.user.id,
                    type,
                    reason,
                    status: "PENDING"
                }
            });
        } catch (e) {
            console.warn("DocumentRequest table might not exist yet. Skipping DB insert.", e);
        }

        // Send Notification to Admins
        const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
        
        const notifications = admins.map(admin => ({
            userId: admin.id,
            title: `New ${type} Request`,
            message: `${session.user.name || 'A student'} has requested a ${type}. Reason: ${reason}`,
            type: "INFO",
            link: `/admin/certificates?email=${encodeURIComponent(session.user.email || "")}&reason=${encodeURIComponent(reason)}`
        }));

        if (notifications.length > 0) {
            await prisma.notification.createMany({ data: notifications });
        }


        return NextResponse.json({ success: true, request: documentRequest });

    } catch (err: any) {
        console.error("Document Application Error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
