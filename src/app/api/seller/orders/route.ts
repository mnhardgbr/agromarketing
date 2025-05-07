import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prismadb';

// GET /api/seller/orders - Obter pedidos do vendedor
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        listings: {
          include: {
            orderItems: {
              include: {
                order: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true,
                        phone: true,
                      },
                    },
                    items: {
                      include: {
                        listing: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Coletar todos os pedidos únicos dos itens de pedido
    const orders = user.listings
      .flatMap((listing) => listing.orderItems)
      .map((orderItem) => orderItem.order)
      .filter((order, index, self) => self.findIndex((o) => o.id === order.id) === index)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Erro ao obter pedidos do vendedor:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 