import { openai } from '@ai-sdk/openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import { QdrantVectorStore } from '@langchain/qdrant'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { SYSTEM_PROMPT } from '@/constant/system-prompt'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()
  const lastMessage = messages[messages.length - 1].parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join(' ')

  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
  })

  const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: 'notebook-llm-rag',
  })

  const vectorSearcher = vectorStore.asRetriever({
    k: 3,
  })

  const relevantChunks = await vectorSearcher.invoke(lastMessage)

  const result = streamText({
    model: openai('gpt-4o'),
    temperature: 0.4,
    system: SYSTEM_PROMPT(JSON.stringify(relevantChunks)),
    messages: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
