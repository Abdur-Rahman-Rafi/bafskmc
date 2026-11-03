import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const SR_CONFIG_KEY = "site_section_representatives";

export interface SectionRep {
    id: string;
    name: string;
    section: string;
    class: string;
    image: string | null;
    priority: number;
    fbId?: string | null;
    createdAt: string;
}

// Sample fallback/starter SRs if none exist in the database yet
export const INITIAL_SRS: SectionRep[] = [
    {
        id: "sr-1",
        name: "Abir Hasan",
        class: "Class 12",
        section: "Titan",
        image: null,
        priority: 1,
        fbId: "",
        createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
        id: "sr-2",
        name: "Nafisa Rahman",
        class: "Class 12",
        section: "Mars",
        image: null,
        priority: 2,
        fbId: "",
        createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
        id: "sr-3",
        name: "Tanvir Ahmed",
        class: "Class 11",
        section: "Jupiter",
        image: null,
        priority: 3,
        fbId: "",
        createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
        id: "sr-4",
        name: "Sadia Islam",
        class: "Class 11",
        section: "Venus",
        image: null,
        priority: 4,
        fbId: "",
        createdAt: "2026-01-01T00:00:00.000Z"
    }
];

export async function getSRList(): Promise<SectionRep[]> {
    try {
        const config = await prisma.siteConfig.findUnique({
            where: { key: SR_CONFIG_KEY }
        });

        if (!config || !config.value) {
            // Auto-seed to MySQL so all default IDs exist and can be edited/deleted immediately
            try {
                await prisma.siteConfig.upsert({
                    where: { key: SR_CONFIG_KEY },
                    update: {},
                    create: {
                        key: SR_CONFIG_KEY,
                        value: JSON.stringify(INITIAL_SRS)
                    }
                });
            } catch (seedErr) {
                console.error("Auto-seed error:", seedErr);
            }
            return [...INITIAL_SRS];
        }

        const list: SectionRep[] = JSON.parse(config.value);
        list.sort((a, b) => (a.priority || 0) - (b.priority || 0));
        return list;
    } catch (error) {
        console.error("Error reading SR list:", error);
        return [...INITIAL_SRS];
    }
}

export async function saveSRList(list: SectionRep[]): Promise<void> {
    list.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    await prisma.siteConfig.upsert({
        where: { key: SR_CONFIG_KEY },
        update: { value: JSON.stringify(list) },
        create: { key: SR_CONFIG_KEY, value: JSON.stringify(list) }
    });
}

export async function GET() {
    try {
        const list = await getSRList();
        return NextResponse.json(list, {
            headers: { "Cache-Control": "no-store, max-age=0" }
        });
    } catch (error) {
        console.error("GET /api/sr error:", error);
        return NextResponse.json({ error: "Failed to fetch SR records" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const role = session?.user?.role?.toUpperCase();
        if (!session || (role !== "ADMIN" && role !== "MODERATOR")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        if (!body.name || !body.class || !body.section) {
            return NextResponse.json({ error: "Name, Class, and Section are required" }, { status: 400 });
        }

        const list = await getSRList();

        const newSr: SectionRep = {
            id: `sr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: body.name.trim(),
            class: body.class.trim(),
            section: body.section.trim(),
            image: body.image || null,
            priority: parseInt(body.priority, 10) || (list.length + 1),
            fbId: body.fbId ? body.fbId.trim() : null,
            createdAt: new Date().toISOString()
        };

        list.push(newSr);
        await saveSRList(list);

        return NextResponse.json(newSr, { status: 201 });
    } catch (error) {
        console.error("SR creation error:", error);
        return NextResponse.json({ error: "Failed to register SR" }, { status: 500 });
    }
}
