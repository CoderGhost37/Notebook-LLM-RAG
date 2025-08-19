'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useRef, useState } from 'react'

import { ChatHeader } from './chat-header'
import { ChatInput } from './chat-input'
import { ChatMessages } from './chat-messages'

export function ChatWindow() {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [input, setInput] = useState<string>('')

  const { messages, sendMessage, status, regenerate, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    messages: [
      {
        id: 'initial',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: 'Hello! How can I help you today?',
          },
        ],
      },
    ],
  })

  const clearChat = () => {
    setMessages([
      {
        id: 'initial',
        role: 'assistant',
        parts: [
          {
            type: 'text',
            text: 'Hello! How can I help you today?',
          },
        ],
      },
    ])
  }

  const handleChangeInput = (val: string) => {
    setInput(val)
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView()
    }
  }, [messages])

  const _scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const _copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage({
      parts: [{ type: 'text', text: input }],
    })
    setInput('')
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ChatHeader clearChat={clearChat} />

      <ChatMessages messages={messages} status={status} regenerate={regenerate} />
      <div ref={messagesEndRef} />

      <ChatInput
        input={input}
        handleInputChange={handleChangeInput}
        onSubmit={onSubmit}
        disabled={status === 'streaming' || status === 'submitted'}
      />
    </div>
  )
}
