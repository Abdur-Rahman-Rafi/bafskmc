import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const config = await prisma.siteConfig.findUnique({
            where: { key: "PANEL_APPLICATION_STATUS" }
        });
        
        const startDate = config?.updatedAt || new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 15);
        
        return NextResponse.json({ 
            isOpen: config?.value !== "CLOSED",
            startDate: startDate.toISOString(),
            deadline: endDate.toISOString()
        });
    } catch (err) {
        const now = new Date();
        const end = new Date(now);
        end.setDate(now.getDate() + 15);
        return NextResponse.json({ 
            isOpen: true, 
            startDate: now.toISOString(), 
            deadline: end.toISOString() 
        });
    }
}

export async function POST(req: Request) {
    try {
        const config = await prisma.siteConfig.findUnique({
            where: { key: "PANEL_APPLICATION_STATUS" }
        });

        if (config?.value === "CLOSED") {
            return NextResponse.json({ error: "Applications are currently closed." }, { status: 403 });
        }
        const data = await req.json();

        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.studentClass || !data.section || !data.pictureUrl || !data.firstYearResult || !data.resultCardUrl || !data.experience || !data.socialProofUrl) {
            return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
        }

        const application = await prisma.panelApplication.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                studentClass: data.studentClass,
                section: data.section,
                pictureUrl: data.pictureUrl,
                firstYearResult: data.firstYearResult,
                resultCardUrl: data.resultCardUrl,
                experience: data.experience,
                testimonialUrl: data.testimonialUrl,
                socialProofUrl: data.socialProofUrl,
            },
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error: any) {
        console.error("Error creating panel application:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
