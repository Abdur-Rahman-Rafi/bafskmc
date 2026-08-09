import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the panel application for the logged in user based on email
    const application = await prisma.panelApplication.findFirst({
      where: { email: session.user.email },
      include: {
        judgeMarks: {
          include: { judge: true },
        },
        progress: {
          include: { hop: true },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'No application found for this user.' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching panel result:', error);
    return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 });
  }
}
