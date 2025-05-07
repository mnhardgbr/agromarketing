import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/notifications - Obter notificações do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        notifications: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    return NextResponse.json(user?.notifications || []);
  } catch (error) {
    console.error('Erro ao obter notificações:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST /api/notifications - Criar nova notificação
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { title, message, userId } = await request.json();

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        userId
      }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PATCH /api/notifications/[notificationId] - Marcar notificação como lida
export async function PATCH(
  request: Request,
  { params }: { params: { notificationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const notification = await prisma.notification.update({
      where: {
        id: params.notificationId
      },
      data: {
        read: true
      }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE /api/notifications/[notificationId] - Deletar notificação
export async function DELETE(
  request: Request,
  { params }: { params: { notificationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await prisma.notification.delete({
      where: {
        id: params.notificationId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 