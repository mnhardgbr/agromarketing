import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { database } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: User;
  seen: boolean;
}

export function useChat(conversationId: string) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId || !session?.user?.email) return;

    const messagesRef = ref(database, `messages/${conversationId}`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const messagesList = Object.values(messagesData) as Message[];
        setMessages(
          messagesList.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        );
      }
      setLoading(false);
    });

    return () => {
      off(messagesRef);
    };
  }, [conversationId, session?.user?.email]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !session?.user?.email) return;

    try {
      const response = await fetch(`/api/chat/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
} 