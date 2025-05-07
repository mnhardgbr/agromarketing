'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import getConversationById from '@/actions/getConversationById';
import MessageInput from './MessageInput';
import Message from './Message';
import { useChat } from '@/hooks/useChat';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';

// Prisma types
interface PrismaUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date | null;
  image: string | null;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  content: string;
  read: boolean;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  conversationId: string;
  sender: PrismaUser;
  receiver: PrismaUser;
}

interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  listingId: string;
  users: PrismaUser[];
  messages: ChatMessage[];
}

// Firebase types (from useChat)
interface FirebaseMessage {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
  seen: boolean;
}

interface ChatWindowProps {
  conversationId: string;
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading: messagesLoading, sendMessage } = useChat(conversationId);
  const { typingUsers } = useTypingIndicator(conversationId);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const data = await getConversationById(conversationId);
        if (data) {
          setConversation(data as Conversation);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversation:', error);
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading || messagesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Conversa não encontrada</p>
      </div>
    );
  }

  const otherUser = conversation.users[0];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <div className="relative h-10 w-10">
          <Image
            src={otherUser.image || '/placeholder.png'}
            alt={otherUser.name || 'Usuário'}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="ml-4">
          <h3 className="font-medium">{otherUser.name}</h3>
          {typingUsers.includes(otherUser.email) && (
            <p className="text-sm text-gray-500">Digitando...</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: FirebaseMessage) => (
          <Message
            key={message.id}
            message={message}
            isOwn={message.sender.id === otherUser.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <MessageInput conversationId={conversationId} onSendMessage={sendMessage} />
      </div>
    </div>
  );
} 