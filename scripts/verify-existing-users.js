/**
 * One-time migration: marks all pre-existing users as email-verified.
 * Run ONCE after adding the emailVerified field:
 *   node scripts/verify-existing-users.js
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.user.updateMany({
        where: { emailVerified: false },
        data: { emailVerified: true },
    });
    console.log(`✅ Marked ${result.count} existing users as email-verified.`);
}

main()
    .catch((e) => { console.error("❌ Error:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());
