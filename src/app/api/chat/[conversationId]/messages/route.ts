import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prismadb';
import { database } from '@/lib/firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

// Get all messages for a conversation
export async function GET(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        conversationId: params.conversationId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Send a new message
export async function POST(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Get conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: params.conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Get other user
    const otherUser = conversation.users.find(
      (user) => user.email !== session.user.email
    );

    if (!otherUser) {
      return new NextResponse('Other user not found', { status: 404 });
    }

    // Create message in PostgreSQL
    const message = await prisma.chatMessage.create({
      data: {
        content,
        conversationId: params.conversationId,
        senderId: currentUser.id,
        receiverId: otherUser.id,
      },
      include: {
        sender: true,
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: {
        id: params.conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    // Save message to Firebase
    const messagesRef = ref(database, `messages/${params.conversationId}`);
    await push(messagesRef, {
      ...message,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 