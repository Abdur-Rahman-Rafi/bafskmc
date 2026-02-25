
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const tables = await prisma.$queryRaw`SHOW TABLES`;
        console.log('Tables in database:', tables);

        // Check if PasswordResetToken table is there
        const count = await prisma.passwordResetToken.count();
        console.log('PasswordResetToken count:', count);
    } catch (error) {
        console.error('ERROR during check:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
