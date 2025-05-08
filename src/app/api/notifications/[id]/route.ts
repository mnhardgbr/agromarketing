import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prismadb';
import { database } from '@/lib/firebase';
import { ref, update, remove } from 'firebase/database';

export async function PATCH(
  request: Request,
  context: any
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = context?.params?.id;
    const body = await request.json();
    const { read } = body;

    if (read === undefined) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Update notification in PostgreSQL
    const notification = await prisma.notification.update({
      where: {
        id: id,
        userId: session.user.email,
      },
      data: {
        read,
      },
    });

    // Update notification in Firebase
    const notificationRef = ref(database, `notifications/${session.user.email}/${id}`);
    await update(notificationRef, {
      read,
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: any
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = context?.params?.id;
    // Delete notification from PostgreSQL
    await prisma.notification.delete({
      where: {
        id: id,
        userId: session.user.email,
      },
    });

    // Delete notification from Firebase
    const notificationRef = ref(database, `notifications/${session.user.email}/${id}`);
    await remove(notificationRef);

    return new NextResponse('OK');
  } catch (error) {
    console.error('Error deleting notification:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 