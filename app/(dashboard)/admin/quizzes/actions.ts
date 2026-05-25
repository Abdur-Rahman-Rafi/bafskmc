"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createQuiz(data: { name: string, category: string, startTime: Date, endTime: Date, duration: number, questionFileUrl?: string }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    return prisma.exam.create({
        data: {
            name: data.name,
            category: data.category,
            startTime: data.startTime,
            endTime: data.endTime,
            regEndTime: data.endTime, // Not strictly used for quizzes but required by schema
            duration: data.duration,
            questionFileUrl: data.questionFileUrl,
            isQuizCompetition: true,
            creatorId: session.user.id
        }
    });
}

export async function getQuizzes() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    return prisma.exam.findMany({
        where: { isQuizCompetition: true },
        orderBy: { startTime: "desc" }
    });
}

export async function deleteQuiz(id: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    return prisma.exam.delete({
        where: { id }
    });
}

export async function getQuizSubmissions(quizId: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    return prisma.submission.findMany({
        where: { examId: quizId },
        orderBy: { submittedAt: "desc" }
    });
}
