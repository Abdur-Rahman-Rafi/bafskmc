import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await prisma.panelApplication.findUnique({
      where: { id: params.id },
      include: {
        judgeMarks: true,
        progress: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const judges = await prisma.judge.findMany({ where: { isActive: true } });
    const hops = await prisma.progressHop.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });

    return NextResponse.json({ application, judges, hops });
  } catch (error) {
    console.error('Error fetching evaluation data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applicationId = params.id;
    const { judgeMarks, progress, clubComment, chosenPanel } = await req.json();

    const updatedApplication = await prisma.$transaction(async (tx) => {
      let totalMarks = 0;
      if (judgeMarks && judgeMarks.length > 0) {
        for (const jm of judgeMarks) {
          totalMarks += jm.mark;
          await tx.judgeMark.upsert({
            where: {
              judgeId_applicationId: { judgeId: jm.judgeId, applicationId },
            },
            update: { mark: jm.mark },
            create: { judgeId: jm.judgeId, applicationId, mark: jm.mark },
          });
        }
      }

      if (progress && progress.length > 0) {
        for (const p of progress) {
          await tx.applicationProgress.upsert({
            where: {
              applicationId_hopId: { applicationId, hopId: p.hopId },
            },
            update: { isCompleted: p.isCompleted },
            create: { applicationId, hopId: p.hopId, isCompleted: p.isCompleted },
          });
        }
      }

      const application = await tx.panelApplication.update({
        where: { id: applicationId },
        data: {
          clubComment,
          chosenPanel,
          totalMarks,
        },
      });

      return application;
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error evaluating application:', error);
    return NextResponse.json({ error: 'Failed to evaluate application' }, { status: 500 });
  }
}
