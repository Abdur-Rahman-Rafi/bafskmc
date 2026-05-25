"use server";

import { prisma } from "@/lib/prisma";

export async function getAvailableQuizzes() {
    return prisma.exam.findMany({
        where: { isQuizCompetition: true },
        orderBy: { startTime: "asc" }
    });
}

export async function submitQuizAnswers(quizId: string, answers: any, guestData: any) {
    // We allow multiple submissions from the same guestData ideally we would block by phone/roll if needed,
    // but for simplicity we just create it.
    
    return prisma.submission.create({
        data: {
            examId: quizId,
            guestData,
            answers,
            status: "SUBMITTED"
        }
    });
}

export async function cancelQuizDueToCheating(quizId: string, reason: string, guestData: any) {
    return prisma.submission.create({
        data: {
            examId: quizId,
            guestData,
            feedback: `Cancelled: ${reason}`,
            status: "CANCELLED_DUE_TO_CHEATING",
            score: 0
        }
    });
}

export async function getQuizDetails(id: string) {
    return prisma.exam.findUnique({
        where: { id }
    });
}
