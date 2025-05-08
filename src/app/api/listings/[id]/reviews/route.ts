import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prismadb";

export async function GET(
  request: Request,
  context: any
) {
  try {
    const id = context?.params?.id;
    const reviews = await prisma.review.findMany({
      where: {
        listingId: id,
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
    console.error('Error fetching reviews:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: any
) {
  try {
    const id = context?.params?.id;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return new NextResponse("Invalid rating", { status: 400 });
    }

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: id },
      select: { userId: true },
    });

    if (!listing) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Prevent seller from reviewing their own listing
    if (listing.userId === currentUser.id) {
      return new NextResponse("Cannot review your own listing", { status: 400 });
    }

    // Check if user has already reviewed this listing
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: currentUser.id,
        listingId: id,
      },
    });

    if (existingReview) {
      return new NextResponse("You have already reviewed this listing", { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: currentUser.id,
        listingId: id,
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

    // Create notification for the seller
    await prisma.notification.create({
      data: {
        title: "Nova Avaliação",
        message: `Seu anúncio recebeu uma nova avaliação de ${currentUser.name}`,
        userId: listing.userId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 