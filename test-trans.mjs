import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const appId = "cmslxqus00000cn38epf7paut"; 
  const judge = await prisma.judge.findFirst();

  const data = {
    status: "ACCEPTED",
    judgeMarks: [{ judgeId: judge.id, mark: 50 }],
    progress: []
  };

  const currentApp = await prisma.panelApplication.findUnique({ where: { id: appId } });

  try {
    const updateData = {};
    if (data.status !== undefined) updateData.status = data.status;

    const application = await prisma.$transaction(async (tx) => {
        let totalMarks = currentApp?.totalMarks || 0;

        if (data.judgeMarks) {
            totalMarks = 0;
            for (const jm of data.judgeMarks) {
                totalMarks += jm.mark;
                await tx.judgeMark.upsert({
                    where: {
                        judgeId_applicationId: { judgeId: jm.judgeId, applicationId: appId },
                    },
                    update: { mark: jm.mark },
                    create: { judgeId: jm.judgeId, applicationId: appId, mark: jm.mark },
                });
            }
            updateData.totalMarks = totalMarks;
        }

        return await tx.panelApplication.update({
            where: { id: appId },
            data: updateData
        });
    });
    console.log("SUCCESS:", application);
  } catch (err) {
    console.error("FAILED:", err);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
