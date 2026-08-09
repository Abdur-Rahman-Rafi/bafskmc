import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const judges = await prisma.judge.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(judges);
  } catch (error) {
    console.error('Error fetching judges:', error);
    return NextResponse.json({ error: 'Failed to fetch judges' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, isActive } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const judge = await prisma.judge.create({
      data: {
        name,
        isActive: isActive ?? true,
      },
    });
    return NextResponse.json(judge);
  } catch (error) {
    console.error('Error creating judge:', error);
    return NextResponse.json({ error: 'Failed to create judge' }, { status: 500 });
  }
}
