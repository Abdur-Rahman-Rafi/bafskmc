import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = params.id;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, order, isActive } = await req.json();

    const hop = await prisma.progressHop.update({
      where: { id },
      data: { title, order, isActive },
    });
    return NextResponse.json(hop);
  } catch (error) {
    console.error('Error updating hop:', error);
    return NextResponse.json({ error: 'Failed to update hop' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = params.id;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.progressHop.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Hop deleted' });
  } catch (error) {
    console.error('Error deleting hop:', error);
    return NextResponse.json({ error: 'Failed to delete hop' }, { status: 500 });
  }
}
