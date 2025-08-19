import { Document } from '@langchain/core/documents'
import { OpenAIEmbeddings } from '@langchain/openai'
import { QdrantVectorStore } from '@langchain/qdrant'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const text = formData.get('text') as string

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const docs = [new Document({ pageContent: text })]
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
        name: text.substring(0, 50),
        type: 'text',
        chunks: chunks.length,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Text embedded and stored in Qdrant successfully.',
    })
  } catch (error) {
    console.error('Error embedding text:', error)
    return NextResponse.json({ error: 'Failed to embed text' }, { status: 500 })
  }
}
