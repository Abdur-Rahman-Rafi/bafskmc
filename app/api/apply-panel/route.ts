import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.studentClass || !data.section || !data.pictureUrl || !data.firstYearResult || !data.resultCardUrl || !data.experience || !data.testimonialUrl || !data.socialProofUrl) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
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
