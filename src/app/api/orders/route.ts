import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prismadb';

// GET /api/orders - Obter pedidos do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        orders: {
          include: {
            items: {
              include: {
                listing: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    return NextResponse.json(user?.orders || []);
  } catch (error) {
    console.error('Erro ao obter pedidos:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST /api/orders - Criar novo pedido
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { shippingAddress, shippingCity, shippingState, shippingZipCode } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: {
              include: {
                listing: true
              }
            }
          }
        }
      }
    });

    if (!user?.cart?.items.length) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    // Calcular valor total
    const totalAmount = user.cart.items.reduce(
      (acc, item) => acc + item.listing.price * item.quantity,
      0
    );

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZipCode,
        items: {
          create: user.cart.items.map(item => ({
            listingId: item.listing.id,
            quantity: item.quantity,
            price: item.listing.price
          }))
        }
      },
      include: {
        items: {
          include: {
            listing: true
          }
        }
      }
    });

    // Limpar carrinho
    await prisma.cartItem.deleteMany({
      where: {
        cartId: user.cart.id
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PATCH /api/orders/[orderId] - Atualizar status do pedido
export async function PATCH(
  request: Request,
  context: any
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { status, paymentId } = await request.json();
    const orderId = context?.params?.orderId;

    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status,
        paymentId
      },
      include: {
        items: {
          include: {
            listing: true
          }
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 