import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET /api/reviews - Obter avaliações de um anúncio
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json({ error: 'ID do anúncio não fornecido' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        listingId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Erro ao obter avaliações:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST /api/reviews - Criar nova avaliação
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { listingId, rating, comment } = await request.json();

    if (!listingId || !rating) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se o usuário já avaliou este anúncio
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        listingId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Você já avaliou este anúncio' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: user.id,
        listingId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// PATCH /api/reviews/[reviewId] - Atualizar avaliação
export async function PATCH(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { rating, comment } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const review = await prisma.review.findUnique({
      where: {
        id: params.reviewId,
      },
    });

    if (!review) {
      return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 });
    }

    if (review.userId !== user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar esta avaliação' },
        { status: 403 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: {
        id: params.reviewId,
      },
      data: {
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE /api/reviews/[reviewId] - Deletar avaliação
export async function DELETE(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const review = await prisma.review.findUnique({
      where: {
        id: params.reviewId,
      },
    });

    if (!review) {
      return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 });
    }

    if (review.userId !== user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar esta avaliação' },
        { status: 403 }
      );
    }

    await prisma.review.delete({
      where: {
        id: params.reviewId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 