'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (content: string) => Promise<void>;
}

export default function MessageInput({ conversationId, onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { startTyping, stopTyping } = useTypingIndicator(conversationId);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (message.trim()) {
      startTyping();
      timeout = setTimeout(() => {
        stopTyping();
      }, 3000);
    } else {
      stopTyping();
    }

    return () => {
      clearTimeout(timeout);
      stopTyping();
    };
  }, [message, startTyping, stopTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    stopTyping();

    try {
      await onSendMessage(message);
      setMessage('');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite uma mensagem..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
} 