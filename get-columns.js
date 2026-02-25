
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const columns = await prisma.$queryRaw`DESCRIBE User`;
        console.log('User table columns:', columns.map(c => c.Field));
    } catch (error) {
        console.error('ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
