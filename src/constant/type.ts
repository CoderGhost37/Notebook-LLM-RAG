export type DataSourceType = 'file' | 'url' | 'text'
export type FileType = 'pdf' | 'csv' | 'docx'
export type StatusType = 'processing' | 'ready' | 'error'

export interface DataSource {
  id: string
  name: string
  type: DataSourceType
  fileType?: FileType
  size?: string
  url?: string
  status: 'processing' | 'ready' | 'error'
  addedAt: string
  chunks?: number
}

export const data = [
  {
    id: '1',
    name: 'Research Paper.pdf',
    type: 'file' as DataSourceType,
    fileType: 'pdf' as FileType,
    size: '2.3 MB',
    status: 'ready' as StatusType,
    addedAt: '2024-01-15',
    chunks: 45,
  },
  {
    id: '2',
    name: 'Company Data.csv',
    type: 'file' as DataSourceType,
    fileType: 'csv' as FileType,
    size: '1.8 MB',
    status: 'ready' as StatusType,
    addedAt: '2024-01-14',
    chunks: 23,
  },
  {
    id: '3',
    name: 'https://docs.example.com',
    type: 'url' as DataSourceType,
    status: 'processing' as StatusType,
    addedAt: '2024-01-16',
  },
  {
    id: '4',
    name: 'Meeting Notes',
    type: 'text' as DataSourceType,
    status: 'ready' as StatusType,
    addedAt: '2024-01-13',
    chunks: 8,
  },
  {
    id: '5',
    name: 'Product Images.zip',
    type: 'file' as DataSourceType,
    fileType: 'docx' as FileType,
    size: '15.2 MB',
    status: 'error' as StatusType,
    addedAt: '2024-01-16',
  },
]
