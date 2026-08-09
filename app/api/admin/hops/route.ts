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

    const hops = await prisma.progressHop.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(hops);
  } catch (error) {
    console.error('Error fetching hops:', error);
    return NextResponse.json({ error: 'Failed to fetch hops' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, order, isActive } = await req.json();

    if (!title || typeof order !== 'number') {
      return NextResponse.json({ error: 'Title and order are required' }, { status: 400 });
    }

    const hop = await prisma.progressHop.create({
      data: {
        title,
        order,
        isActive: isActive ?? true,
      },
    });
    return NextResponse.json(hop);
  } catch (error) {
    console.error('Error creating hop:', error);
    return NextResponse.json({ error: 'Failed to create hop' }, { status: 500 });
  }
}
