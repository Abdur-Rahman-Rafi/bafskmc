const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function findRelations(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return console.log("User not found");

    const results = {};
    const models = Object.keys(prisma).filter(k => k[0] !== '_' && typeof prisma[k] === 'object' && prisma[k].count);

    for (const model of models) {
        try {
            // Try common FK names
            const count1 = await prisma[model].count({ where: { userId } }).catch(() => 0);
            const count2 = await prisma[model].count({ where: { studentId: userId } }).catch(() => 0);
            const count3 = await prisma[model].count({ where: { creatorId: userId } }).catch(() => 0);
            const count4 = await prisma[model].count({ where: { authorId: userId } }).catch(() => 0);
            const count5 = await prisma[model].count({ where: { email: user.email } }).catch(() => 0);

            const total = count1 + count2 + count3 + count4 + count5;
            if (total > 0) results[model] = total;
        } catch (e) { }
    }

    console.log("Relations found for user:", user.email);
    console.log(JSON.stringify(results, null, 2));
}

findRelations(process.argv[2]);
