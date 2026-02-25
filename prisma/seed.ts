import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.upsert({
        where: { email: "admin@bafsk.com" },
        update: {
            role: "ADMIN",
        },
        create: {
            email: "admin@bafsk.com",
            name: "BAFSK Admin",
            password,
            role: "ADMIN",
        },
    });

    console.log("Seeding complete. Admin user created:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
