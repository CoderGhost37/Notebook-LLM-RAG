'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { OpenAIEmbeddings } from '@langchain/openai'
import { QdrantVectorStore } from '@langchain/qdrant'

export async function getDataSources() {
  try {
    const data = await prisma.dataSource.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return data || []
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function deleteDataSource(id: string) {
  try {
    const dataSource = await prisma.dataSource.findUnique({
      where: { id },
      select: {
        chunkIds: true,
      }
    })

    if (!dataSource) {
      return {
        success: false,
        message: 'Data source not found',
      }
    }

    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
    })

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: 'notebook-llm-rag',
      }
    )
    await vectorStore.delete({ ids: dataSource.chunkIds });
    await prisma.dataSource.delete({
      where: { id },
    })

    revalidatePath('/')

    return {
      success: true,
      message: 'Data source deleted successfully',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Failed to delete data source',
    }
  }
}
