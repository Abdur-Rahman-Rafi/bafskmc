import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const appId = "cmslxqus00000cn38epf7paut"; // The applicant we just seeded

  // create a judge
  const judge = await prisma.judge.create({ data: { name: "Test Judge" } });

  const data = {
    status: "ACCEPTED",
    judgeMarks: [{ judgeId: judge.id, mark: 50 }],
    progress: []
  };

  const currentApp = await prisma.panelApplication.findUnique({ where: { id: appId } });

  try {
    const updateData: any = {};
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

        if (data.progress) {
            for (const p of data.progress) {
                await tx.applicationProgress.upsert({
                    where: {
                        applicationId_hopId: { applicationId: appId, hopId: (p as any).hopId },
                    },
                    update: { isCompleted: (p as any).isCompleted },
                    create: { applicationId: appId, hopId: (p as any).hopId, isCompleted: (p as any).isCompleted },
                });
            }
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
