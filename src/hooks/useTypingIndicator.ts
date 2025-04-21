import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { database } from '@/lib/firebase';
import { ref, onValue, off, set, onDisconnect } from 'firebase/database';

export function useTypingIndicator(conversationId: string) {
  const { data: session } = useSession();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!session?.user?.email || !conversationId) return;

    const typingRef = ref(database, `typing/${conversationId}`);

    // Listen for typing users
    const unsubscribe = onValue(typingRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = Object.keys(snapshot.val());
        setTypingUsers(users.filter((email) => email !== session.user.email));
      } else {
        setTypingUsers([]);
      }
    });

    return () => {
      off(typingRef);
    };
  }, [conversationId, session?.user?.email]);

  const startTyping = () => {
    if (!session?.user?.email || !conversationId) return;

    const userTypingRef = ref(database, `typing/${conversationId}/${session.user.email}`);
    set(userTypingRef, true);

    // Stop typing after 3 seconds
    setTimeout(() => {
      set(userTypingRef, false);
    }, 3000);
  };

  const stopTyping = () => {
    if (!session?.user?.email || !conversationId) return;

    const userTypingRef = ref(database, `typing/${conversationId}/${session.user.email}`);
    set(userTypingRef, false);
  };

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
} 