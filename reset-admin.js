const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetAdmin() {
    try {
        const password = await bcrypt.hash('admin123', 12);
        const admin = await prisma.user.upsert({
            where: { email: 'admin@bafsk.com' },
            update: {
                password: password,
                role: 'ADMIN',
            },
            create: {
                email: 'admin@bafsk.com',
                name: 'Admin_Rafi',
                password: password,
                role: 'ADMIN',
            },
        });
        console.log('Admin password has been reset to: admin123');
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();
