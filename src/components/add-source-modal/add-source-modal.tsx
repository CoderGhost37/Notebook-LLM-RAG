'use client'

import { FileText, Link, Plus, Type } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TextForm } from './text-form'
import { UploadForm } from './upload-form'
import { UrlForm } from './url-form'

export function AddSourceModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Source
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Data Source</DialogTitle>
        </DialogHeader>
        <Tabs className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file" className="gap-2">
              <FileText className="h-4 w-4" />
              Files
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2">
              <Link className="h-4 w-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <Type className="h-4 w-4" />
              Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <UploadForm />
          </TabsContent>
          <TabsContent value="url" className="space-y-4">
            <UrlForm />
          </TabsContent>
          <TabsContent value="text" className="space-y-4">
            <TextForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
