import { RefreshCcw } from 'lucide-react'
import { ModeToggle } from '@/components/theme/theme-toggle'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function ChatHeader({ clearChat }: { clearChat: () => void }) {
  return (
    <div className="hidden lg:block p-4 border-b border-border bg-card flex-shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold text-foreground">RAG Assistant</p>
          <p className="text-sm text-muted-foreground">
            Ask questions about your uploaded data sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={clearChat}>
                  <RefreshCcw className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
