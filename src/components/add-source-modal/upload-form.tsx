'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlignHorizontalDistributeCenter, FileText, FileType } from 'lucide-react'
import { useTransition } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) =>
        [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/csv',
        ].includes(file.type),
      { message: 'Only PDF, DOCX, or CSV files are allowed.' }
    ),
})

type UploadFormValues = z.infer<typeof uploadSchema>

export function UploadForm() {
  const [isPending, startTransition] = useTransition()
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      file: undefined,
    },
  })

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      form.setValue('file', acceptedFiles[0], { shouldValidate: true })
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  })

  async function onSubmit(values: UploadFormValues) {
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('pdf', values.file)

        await fetch('/api/upload-pdf', {
          method: 'POST',
          body: formData,
        })
        alert('File uploaded successfully!')
      } catch (err) {
        console.error(err)
        alert('Upload failed')
      }
    })
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  console.log(form.getValues())

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload File</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <Card className="mt-4 shadow-md border border-gray-200">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <span className="font-medium">{field.value.name}</span>
                          </div>
                          <div className="mt-1 flex gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <FileType className="h-4 w-4" />
                              <span>{field.value.name.split('.').pop()?.toLowerCase()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <AlignHorizontalDistributeCenter className="h-4 w-4" />
                              <span>{formatBytes(field.value.size)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => form.resetField('file')}
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-card"
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p className="text-gray-600">Drop the file here...</p>
                      ) : !field.value ? (
                        <p className="text-gray-500">
                          Drag & drop a PDF, DOCX, or CSV file here, or click to select.
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" loading={isPending} className="w-full">
          Upload
        </Button>
      </form>
    </Form>
  )
}
