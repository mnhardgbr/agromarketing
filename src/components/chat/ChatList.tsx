'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useConversations } from '@/hooks/useConversations';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function ChatList() {
  const router = useRouter();
  const { conversations, loading } = useConversations();
  const { isUserOnline } = useOnlineStatus();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {conversations.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Nenhuma conversa encontrada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const otherUser = conversation.users[0];
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            const isOnline = isUserOnline(otherUser.email);

            return (
              <div
                key={conversation.id}
                onClick={() => router.push(`/chat/${conversation.id}`)}
                className="flex items-center p-4 hover:bg-gray-100 cursor-pointer rounded-lg transition"
              >
                <div className="relative h-12 w-12">
                  <Image
                    src={otherUser.image || '/placeholder.png'}
                    alt={otherUser.name || 'Usuário'}
                    fill
                    className="rounded-full object-cover"
                  />
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{otherUser.name}</h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(conversation.lastMessageAt), 'HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage?.content || 'Nenhuma mensagem'}
                  </p>
                </div>
                {!lastMessage?.seen && (
                  <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 