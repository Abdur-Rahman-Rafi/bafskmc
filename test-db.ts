import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking database connection...");
        const users = await prisma.user.findMany();
        console.log("Connection successful! Found", users.length, "users.");
    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
