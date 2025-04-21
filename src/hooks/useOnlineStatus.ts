import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { database } from '@/lib/firebase';
import { ref, onValue, off, set, onDisconnect } from 'firebase/database';

export function useOnlineStatus() {
  const { data: session } = useSession();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const userRef = ref(database, `users/${session.user.email}`);
    const onlineRef = ref(database, 'online');

    // Set user as online
    set(userRef, true);

    // Set user as offline when they disconnect
    onDisconnect(userRef).set(false);

    // Listen for online users
    const unsubscribe = onValue(onlineRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = Object.keys(snapshot.val());
        setOnlineUsers(users);
      }
    });

    return () => {
      off(onlineRef);
      set(userRef, false);
    };
  }, [session?.user?.email]);

  const isUserOnline = (email: string) => {
    return onlineUsers.includes(email);
  };

  return {
    onlineUsers,
    isUserOnline,
  };
} 