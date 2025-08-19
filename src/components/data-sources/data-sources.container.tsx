'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { data } from '@/constant/type'
import { ModeToggle } from '../theme/theme-toggle'
import { DataSources } from './data-sources'

export function DataSourcesContainer() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4" />
              <span className="ml-2">Data Sources ({data.length})</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <DataSources data={data} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">RAG Assistant</h1>
          <ModeToggle />
        </div>
      </div>

      <div className="hidden lg:block w-80 border-r border-border bg-card">
        <DataSources data={data} />
      </div>
    </>
  )
}
