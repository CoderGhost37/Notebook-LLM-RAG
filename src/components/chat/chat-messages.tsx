'use client'

import type { UIMessage } from 'ai'
import { Bot, Copy, RefreshCw, User } from 'lucide-react'
import Markdown from 'markdown-to-jsx'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MessageLoading } from './message-loading'

interface ChatMessagesProps {
  messages: UIMessage[]
  status: 'error' | 'submitted' | 'streaming' | 'ready'
  regenerate: ({ messageId }: { messageId: string }) => void
}

export function ChatMessages({ messages, status, regenerate }: ChatMessagesProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="p-4">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message: UIMessage, index: number) => (
            <div key={message.id} className="group">
              <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }
                  >
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`flex-1 space-y-2 ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}
                >
                  <div
                    className={`relative max-w-[85%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <div className="space-y-4">
                      {message.parts.map((part, partIndex) => {
                        if (part.type === 'text') {
                          return (
                            <Markdown key={`${message.id}-${partIndex}`} className="py-1 space-y-2">
                              {part.text}
                            </Markdown>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                  {index !== 0 && (
                    <div className="mt-1 flex justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                copyToClipboard(
                                  message.parts
                                    .map((part) => (part.type === 'text' ? part.text : ''))
                                    .join(' ')
                                )
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy message</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {status === 'ready' && message.role === 'assistant' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => regenerate({ messageId: message.id })}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Regenerate response</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {status === 'submitted' && <MessageLoading />}
        </div>
      </div>
    </ScrollArea>
  )
}
