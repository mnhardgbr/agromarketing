'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatList from '@/components/chat/ChatList'
import ChatWindow from '@/components/chat/ChatWindow'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const conversationId = searchParams.get('conversation')

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-1/3 border-r">
        <ChatList />
      </div>
      <div className="w-2/3">
        {conversationId ? (
          <ChatWindow conversationId={conversationId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Selecione uma conversa</p>
          </div>
        )}
      </div>
    </div>
  )
} 