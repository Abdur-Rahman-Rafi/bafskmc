import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { sendResultReportEmail } from '@/lib/email/resultReport';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await prisma.panelApplication.findFirst({
      where: { email: session.user.email },
      include: {
        judgeMarks: { include: { judge: true } },
        progress: { include: { hop: true } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'No application found.' }, { status: 404 });
    }

    await sendResultReportEmail(
      application.email as string,
      application.name,
      application.chosenPanel || 'N/A',
      application.totalMarks || 0,
      application.clubComment || '',
      application.judgeMarks,
      application.progress
    );

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending result report email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
