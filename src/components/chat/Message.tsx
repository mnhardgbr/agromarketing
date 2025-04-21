'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface MessageProps {
  message: {
    id: string;
    content: string;
    createdAt: string;
    sender: User;
    seen: boolean;
  };
  isOwn: boolean;
}

export default function Message({ message, isOwn }: MessageProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} space-x-2`}>
      {!isOwn && (
        <div className="relative h-8 w-8">
          <Image
            src={message.sender.image || '/placeholder.png'}
            alt={message.sender.name || 'Usuário'}
            fill
            className="rounded-full object-cover"
          />
        </div>
      )}
      <div
        className={`max-w-xs rounded-lg p-3 ${
          isOwn ? 'bg-green-500 text-white' : 'bg-gray-100'
        }`}
      >
        <p>{message.content}</p>
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-xs opacity-70">
            {format(new Date(message.createdAt), 'HH:mm', { locale: ptBR })}
          </span>
          {isOwn && (
            <span className="text-xs opacity-70">
              {message.seen ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 