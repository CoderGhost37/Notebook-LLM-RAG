'use client'

import { File, FileSpreadsheet, FileText, Globe, Loader2, Search, Trash2, Type } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteDataSource } from '@/app/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { DataSource } from '@/generated/prisma'
import { AddSourceModal } from '../add-source-modal/add-source-modal'
import { ModeToggle } from '../theme/theme-toggle'

export function DataSources({ data }: { data: DataSource[] }) {
  const [dataSources, setDataSources] = useState<DataSource[]>(data)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'file' | 'url' | 'text'>('all')

  const filteredDataSources = dataSources.filter((source) => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || source.type === filterType
    return matchesSearch && matchesFilter
  })

  const removeDataSource = (id: string) => {
    setDataSources((prev) => prev.filter((source) => source.id !== id))
  }

  const getSourceIcon = (type: string, fileType: string | null) => {
    if (type === 'file' && fileType) {
      switch (fileType) {
        case 'pdf':
          return <FileText className="h-4 w-4 text-red-500" />
        case 'csv':
          return <FileSpreadsheet className="h-4 w-4 text-green-500" />
        case 'docx':
          return <FileText className="h-4 w-4 text-blue-600" />
        default:
          return <File className="h-4 w-4 text-gray-500" />
      }
    }

    switch (type) {
      case 'file':
        return <FileText className="h-4 w-4" />
      case 'url':
        return <Globe className="h-4 w-4 text-green-600" />
      case 'text':
        return <Type className="h-4 w-4 text-purple-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getSourceBadgeColor = (type: string) => {
    switch (type) {
      case 'file':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
      case 'url':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
      case 'text':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800'
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Data Sources</h2>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <AddSourceModal />
          </div>
        </div>
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search data sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
              className="text-xs"
            >
              All ({dataSources.length})
            </Button>
            <Button
              variant={filterType === 'file' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('file')}
              className="text-xs"
            >
              Files ({dataSources.filter((ds) => ds.type === 'file').length})
            </Button>
            <Button
              variant={filterType === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('url')}
              className="text-xs"
            >
              URLs ({dataSources.filter((ds) => ds.type === 'url').length})
            </Button>
            <Button
              variant={filterType === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('text')}
              className="text-xs"
            >
              Text ({dataSources.filter((ds) => ds.type === 'text').length})
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Data Sources List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-3">
          {filteredDataSources.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No data sources found</p>
              <p className="text-xs mt-1">Add some files, URLs, or text to get started</p>
            </div>
          ) : (
            filteredDataSources.map((source) => (
              <Card
                key={source.id}
                className="p-3 hover:bg-accent/50 transition-colors max-w-[350px]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="mt-0.5">{getSourceIcon(source.type, source.fileType)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground truncate flex-1">
                          {source.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getSourceBadgeColor(source.type)}`}
                        >
                          {source.type}
                        </Badge>

                        <span className="flex items-center justify-between text-xs text-muted-foreground">
                          {source.chunks && <span>{source.chunks} chunks</span>}
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground mt-1">
                        Added {new Date(source.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <DeleteDataSource id={source.id} removeSource={removeDataSource} />
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function DeleteDataSource({
  id,
  removeSource,
}: {
  id: string
  removeSource: (id: string) => void
}) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(() => {
      deleteDataSource(id).then((res) => {
        if (res.success) {
          toast.success(res.message)
          removeSource(id)
        } else {
          toast.error(res.message)
        }
      })
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
    >
      {isPending ? <Loader2 className="animate-spin" /> : <Trash2 className="h-3 w-3" />}
    </Button>
  )
}
