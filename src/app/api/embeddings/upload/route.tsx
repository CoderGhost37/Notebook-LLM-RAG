import { CSVLoader } from '@langchain/community/document_loaders/fs/csv'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import { OpenAIEmbeddings } from '@langchain/openai'
import { QdrantVectorStore } from '@langchain/qdrant'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { type NextRequest, NextResponse } from 'next/server'
import type { FileType } from '@/generated/prisma'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Pick loader based on extension
    const ext = file.name.split('.').pop()?.toLowerCase()
    let loader: any

    if (file.type === 'application/pdf') {
      loader = new WebPDFLoader(new Blob([buffer]))
    } else if (ext === '.docx') {
      loader = new DocxLoader(new Blob([buffer]))
    } else if (file.type === 'text/csv') {
      loader = new CSVLoader(new Blob([buffer]))
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const docs = await loader.load()
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    const chunks = await splitter.splitDocuments(docs)

    // Embeddings
    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
    })

    await QdrantVectorStore.fromDocuments(chunks, embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: 'notebook-llm-rag',
    })

    await prisma.dataSource.create({
      data: {
        name: file.name,
        type: 'file',
        fileType: ext as FileType,
        chunks: chunks.length,
      },
    })

    return NextResponse.json({
      success: true,
      message: `File '${file.name}' embedded and stored in Qdrant successfully.`,
    })
  } catch (error) {
    console.error('Error embedding file:', error)
    return NextResponse.json({ error: 'Failed to embed file' }, { status: 500 })
  }
}
