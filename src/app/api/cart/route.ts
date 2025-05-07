import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prismadb';

// GET /api/cart - Obter carrinho do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

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

    if (!user?.cart) {
      // Criar carrinho se não existir
      const cart = await prisma.cart.create({
        data: {
          userId: user!.id,
          items: []
        },
        include: {
          items: {
            include: {
              listing: true
            }
          }
        }
      });
      return NextResponse.json(cart);
    }

    return NextResponse.json(user.cart);
  } catch (error) {
    console.error('Erro ao obter carrinho:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST /api/cart - Adicionar item ao carrinho
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { listingId, quantity } = await request.json();
    if (!listingId || !quantity) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cart: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    let cart = user.cart;
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id
        }
      });
    }

    // Verificar se o item já existe no carrinho
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_listingId: {
          cartId: cart.id,
          listingId
        }
      }
    });

    if (existingItem) {
      // Atualizar quantidade
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      // Adicionar novo item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          listingId,
          quantity
        }
      });
    }

    // Retornar carrinho atualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            listing: true
          }
        }
      }
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE /api/cart - Remover item do carrinho
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { listingId } = await request.json();
    if (!listingId) {
      return NextResponse.json({ error: 'ID do item não fornecido' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cart: true }
    });

    if (!user?.cart) {
      return NextResponse.json({ error: 'Carrinho não encontrado' }, { status: 404 });
    }

    // Remover item do carrinho
    await prisma.cartItem.delete({
      where: {
        cartId_listingId: {
          cartId: user.cart.id,
          listingId
        }
      }
    });

    // Retornar carrinho atualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { id: user.cart.id },
      include: {
        items: {
          include: {
            listing: true
          }
        }
      }
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('Erro ao remover item do carrinho:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 