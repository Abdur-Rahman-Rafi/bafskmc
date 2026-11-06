import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ACHIEVEMENTS_CONFIG_KEY = "site_achievement_corner";

export interface AchievementPost {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  images: string[];
  coverImage: string;
  awardedTo?: string;
  rankOrPrize?: string;
}

const SAMPLE_ACHIEVEMENTS: AchievementPost[] = [
  {
    id: "ach-1",
    title: "National Math Olympiad 2025 Championship",
    date: "2025-11-15",
    category: "National Olympiad",
    description: "BAFSK Math Club delegation climched gold and silver medals at the National mathematics championship, securing top positions among 80+ colleges.",
    images: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80"
    ],
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    awardedTo: "BAFSK Math Club Team",
    rankOrPrize: "Champion & Runners Up"
  },
  {
    id: "ach-2",
    title: "Inter-College Intellectual Math Fest",
    date: "2025-08-20",
    category: "College Fest",
    description: "Overall Champion Trophy awarded to BAFSKMC for supremacy in Sudo-Math, Rapid Calculus, and Rubik's Cube solving.",
    images: [
      "https://images.unsplash.com/photo-1546415713183-97d2850a5e9a?auto=format&fit=crop&w=1000&q=80"
    ],
    coverImage: "https://images.unsplash.com/photo-1546415713183-97d2850a5e9a?auto=format&fit=crop&w=1000&q=80",
    awardedTo: "Representative Squad",
    rankOrPrize: "Overall Champion"
  }
];

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: ACHIEVEMENTS_CONFIG_KEY },
    });

    if (!config || !config.value) {
      return NextResponse.json(SAMPLE_ACHIEVEMENTS);
    }

    try {
      const parsed = JSON.parse(config.value);
      return NextResponse.json(Array.isArray(parsed) ? parsed : SAMPLE_ACHIEVEMENTS);
    } catch {
      return NextResponse.json(SAMPLE_ACHIEVEMENTS);
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
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
      where: { key: ACHIEVEMENTS_CONFIG_KEY },
      update: { value: JSON.stringify(data) },
      create: { key: ACHIEVEMENTS_CONFIG_KEY, value: JSON.stringify(data) },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save achievements" }, { status: 500 });
  }
}
