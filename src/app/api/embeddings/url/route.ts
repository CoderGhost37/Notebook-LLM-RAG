import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio'
import { OpenAIEmbeddings } from '@langchain/openai'
import { QdrantVectorStore } from '@langchain/qdrant'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const url = formData.get('url') as string

    if (!url) {
      return NextResponse.json({ error: 'No url provided' }, { status: 400 })
    }

    const loader = new CheerioWebBaseLoader(url)

    const docs = await loader.load()
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    const chunks = await splitter.splitDocuments(docs)

    const chunksWithIds = chunks.map((chunk) => {
      const id = randomUUID()
      return {
        ...chunk,
        metadata: {
          ...chunk.metadata,
          id
        },
      }
    })

    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
    })

    await QdrantVectorStore.fromDocuments(chunksWithIds, embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: 'notebook-llm-rag',
    })

    await prisma.dataSource.create({
      data: {
        name: url,
        type: 'url',
        chunks: chunks.length,
        chunkIds: chunksWithIds.map((chunk) => chunk.metadata.id),
      },
    })
    revalidatePath('/')

    return NextResponse.json({
      success: true,
      message: `Url '${url}' embedded and stored in Qdrant successfully.`,
    })
  } catch (error) {
    console.error('Error embedding url:', error)
    return NextResponse.json({ error: 'Failed to embed url' }, { status: 500 })
  }
}
