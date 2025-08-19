'use client'

import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatInputProps {
  input: string
  handleInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled: boolean
}

export function ChatInput({ input, handleInputChange, onSubmit, disabled }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="p-4 border-t border-border bg-card flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                placeholder="Ask a question about your data sources..."
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[44px] max-h-32 resize-none pr-12"
                disabled={disabled}
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {input.length > 0 && <span>{input.length}</span>}
              </div>
            </div>
            <Button
              size="icon"
              className="h-[44px] px-4"
              type="submit"
              disabled={!input.trim() || disabled}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
