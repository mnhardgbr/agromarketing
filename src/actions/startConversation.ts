'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prismadb';
import { database } from '@/lib/firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

export default async function startConversation(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error('Unauthorized');
    }

    // Get listing and seller details
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                email: session.user.email,
              },
            },
          },
          {
            users: {
              some: {
                email: listing.user.email,
              },
            },
          },
          {
            listingId: id,
          },
        ],
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        listingId: id,
        users: {
          connect: [
            { email: session.user.email },
            { email: listing.user.email },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    // Create initial message
    const message = await prisma.chatMessage.create({
      data: {
        content: `Olá! Tenho interesse no anúncio "${listing.title}"`,
        conversationId: conversation.id,
        senderId: session.user.email,
        receiverId: listing.user.email,
      },
      include: {
        sender: true,
        seen: true,
      },
    });

    // Save conversation to Firebase
    const conversationRef = ref(database, `conversations/${conversation.id}`);
    await push(conversationRef, {
      ...conversation,
      lastMessageAt: serverTimestamp(),
    });

    // Save message to Firebase
    const messagesRef = ref(database, `messages/${conversation.id}`);
    await push(messagesRef, {
      ...message,
      createdAt: serverTimestamp(),
    });

    return conversation;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
} 