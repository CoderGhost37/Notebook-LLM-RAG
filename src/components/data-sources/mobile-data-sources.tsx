'use client'

import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import type { DataSource } from '@/generated/prisma'
import { DataSources } from './data-sources'

export function MobileDataSourcesContainer({ data }: { data: DataSource[] }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
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
  )
}
