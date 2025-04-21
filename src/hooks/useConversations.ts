import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { database } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import getConversations from '@/actions/getConversations';

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

interface Conversation {
  id: string;
  users: User[];
  messages: Message[];
  lastMessageAt: string;
}

export function useConversations() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchInitialConversations = async () => {
      const data = await getConversations();
      setConversations(data);
      setLoading(false);
    };

    fetchInitialConversations();

    const conversationsRef = ref(database, 'conversations');

    const unsubscribe = onValue(conversationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const conversationsData = snapshot.val();
        const conversationsList = Object.values(conversationsData) as Conversation[];
        setConversations(
          conversationsList.sort(
            (a, b) =>
              new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
          )
        );
      }
    });

    return () => {
      off(conversationsRef);
    };
  }, [session?.user?.email]);

  return {
    conversations,
    loading,
  };
} 