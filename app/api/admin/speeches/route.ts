import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SPEECHES_CONFIG_KEY = "site_institutional_speeches";

export interface PrincipalSpeech {
  enabled: boolean;
  name: string;
  designation: string;
  subTitle?: string;
  speech: string;
  imageUrl?: string;
}

export interface ModeratorSpeech {
  id: string;
  name: string;
  roleTitle: string;
  department?: string;
  speech: string;
  imageUrl?: string;
  priority: number;
}

export interface SpeechesConfig {
  principal: PrincipalSpeech;
  moderators: ModeratorSpeech[];
}

const DEFAULT_CONFIG: SpeechesConfig = {
  principal: {
    enabled: true,
    name: "Group Captain Md. Shahidul Islam",
    designation: "Principal, BAF Shaheen College Kurmitola",
    subTitle: "Patron-in-Chief, BAFSK Math Club",
    speech: "Mathematics is the universal language of intellect and discipline. At BAF Shaheen College Kurmitola, we empower young scholars to cultivate rigorous analytical thought and lead with passion.",
    imageUrl: "",
  },
  moderators: [
    {
      id: "mod-1",
      name: "Chief Moderator",
      roleTitle: "Chief Club Moderator",
      department: "Department of Mathematics",
      speech: "Welcome to BAFSKMC. Our objective is to take problem-solving beyond regular textbooks and conquer olympiads on both national and international stages.",
      imageUrl: "",
      priority: 1,
    },
  ],
};

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: SPEECHES_CONFIG_KEY },
    });

    if (!config || !config.value) {
      return NextResponse.json(DEFAULT_CONFIG);
    }

    try {
      const parsed = JSON.parse(config.value);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(DEFAULT_CONFIG);
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch speeches" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    await prisma.siteConfig.upsert({
      where: { key: SPEECHES_CONFIG_KEY },
      update: { value: JSON.stringify(data) },
      create: { key: SPEECHES_CONFIG_KEY, value: JSON.stringify(data) },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save speeches" }, { status: 500 });
  }
}
