const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: ['query', 'error'] });

async function debugDelete(userId) {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return console.log("User not found");

        console.log(`Starting transaction for user ${user.email}`);

        await prisma.$transaction(async (tx) => {
            console.log("1. Deleting Submissions (student)");
            await tx.submission.deleteMany({ where: { studentId: userId } });

            console.log("2. Deleting Registrations (student)");
            await tx.registration.deleteMany({ where: { studentId: userId } });

            console.log("3. Deleting Achievements");
            await tx.achievement.deleteMany({ where: { userId: userId } });

            console.log("4. Deleting Payments");
            await tx.payment.deleteMany({ where: { userId: userId } });

            console.log("5. Deleting PasswordResetTokens");
            await tx.passwordResetToken.deleteMany({ where: { email: user.email } });

            console.log("6. Deleting EmailVerificationTokens");
            await tx.emailVerificationToken.deleteMany({ where: { email: user.email } });

            console.log("7. Deleting Activities");
            await tx.activity.deleteMany({ where: { creatorId: userId } });

            console.log("8. Deleting Resources");
            await tx.resource.deleteMany({ where: { creatorId: userId } });

            console.log("9. Deleting Competitions");
            await tx.competition.deleteMany({ where: { creatorId: userId } });

            console.log("10. Deleting News");
            await tx.news.deleteMany({ where: { authorId: userId } });

            console.log("11. Checking for Exams created by user");
            const exams = await tx.exam.findMany({ where: { creatorId: userId }, select: { id: true } });
            if (exams.length > 0) {
                const examIds = exams.map(e => e.id);
                console.log(`11a. Deleting registrations for ${exams.length} exams`);
                await tx.registration.deleteMany({ where: { examId: { in: examIds } } });
                console.log(`11b. Deleting submissions for ${exams.length} exams`);
                await tx.submission.deleteMany({ where: { examId: { in: examIds } } });
                console.log("11c. Deleting exams");
                await tx.exam.deleteMany({ where: { creatorId: userId } });
            }

            console.log("12. Finally, deleting user");
            await tx.user.delete({ where: { id: userId } });
        });

        console.log("SUCCESS!");

    } catch (error) {
        console.error("ERROR:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

debugDelete(process.argv[2]);
