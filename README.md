# 📖 Retrieval Augmented Generation (RAG) Chatbot  

This project is a **RAG-based chatbot** built with **Next.js**, **OpenAI**, **Qdrant**, and **Postgres**.  
It allows users to **upload documents** (`PDF`, `CSV`, `DOC`), provide a **website URL**, or enter **raw text**, and then **chat with them** in natural language.  

Live URL: https://notebook-llm-rag.vercel.app/

## ⚙️ How It Works  
1. Users upload files, enter text, or provide a website URL.  
2. The content is **chunked** and converted into **vector embeddings** using **OpenAI**.  
3. Embeddings are stored in **Qdrant Vector DB** for semantic search.  
4. Metadata and chat history are stored in **Postgres DB**.  
5. On each query, relevant chunks are retrieved from Qdrant and passed to **OpenAI**, which generates accurate and context-aware responses.  

## ✨ Features  
- Upload files (`.pdf`, `.csv`, `.doc`)  
- Add **website URLs** or paste **raw text**  
- Store embeddings in **Qdrant DB**  
- Persist metadata & chat history in **Postgres DB**  
- Chat with your custom knowledge base in real time  
- Built on **Next.js App Router**  

## 🔑 Environment Variables  

Create a `.env.local` file in the root of your project with the following variables:  

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Qdrant configuration
QDRANT_URL=your_qdrant_instance_url   # e.g., http://localhost:6333 or cloud URL
QDRANT_API_KEY=your_qdrant_api_key    # if authentication is enabled

# Postgres database
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
```


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
