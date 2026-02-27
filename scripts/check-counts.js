const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkAll() {
    const users = await prisma.user.findMany({ select: { id: true, email: true } });
    for (const user of users) {
        const counts = await Promise.all([
            prisma.submission.count({ where: { studentId: user.id } }),
            prisma.registration.count({ where: { studentId: user.id } }),
            prisma.payment.count({ where: { userId: user.id } }),
            prisma.exam.count({ where: { creatorId: user.id } }),
        ]);
        const total = counts.reduce((a, b) => a + b, 0);
        if (total > 0) {
            console.log(`${user.email} (${user.id}): ${total} records`);
        }
    }
    await prisma.$disconnect();
}
checkAll();
