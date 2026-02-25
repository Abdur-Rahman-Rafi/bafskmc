const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmins() {
    try {
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { email: true, name: true, role: true }
        });
        console.log('--- ADMIN USERS ---');
        console.log(admins);
        console.log('-------------------');
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmins();
