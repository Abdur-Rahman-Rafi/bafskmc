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

    const { name, isActive } = await req.json();

    const judge = await prisma.judge.update({
      where: { id },
      data: { name, isActive },
    });
    return NextResponse.json(judge);
  } catch (error) {
    console.error('Error updating judge:', error);
    return NextResponse.json({ error: 'Failed to update judge' }, { status: 500 });
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

    await prisma.judge.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Judge deleted' });
  } catch (error) {
    console.error('Error deleting judge:', error);
    return NextResponse.json({ error: 'Failed to delete judge' }, { status: 500 });
  }
}
