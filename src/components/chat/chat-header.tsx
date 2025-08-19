import { ModeToggle } from '../theme/theme-toggle'

export function ChatHeader() {
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
        </div>
      </div>
    </div>
  )
}
