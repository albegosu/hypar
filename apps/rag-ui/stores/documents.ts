import { defineStore } from 'pinia'

export interface Document {
  id: string
  title: string
  content: string
  sourceType: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
  _count?: { chunks: number }
}

export interface SearchResult {
  chunkId: string
  content: string
  documentId: string
  documentTitle: string
  score: number
  startChar: number
  endChar: number
}

export interface ConverseSource {
  title: string
  id: string
}

export interface ConverseResponse {
  reply: string
  sources: ConverseSource[]
  results: SearchResult[]
}

export interface AgentChatResponse {
  reply: string
  used_kb: boolean
  search_query: string | null
  sources: ConverseSource[]
  results: SearchResult[]
}

export interface DocumentChunk {
  id: string
  content: string
  index: number
  tokenCount: number | null
  startChar: number | null
  endChar: number | null
}

export interface DocumentDetail extends Document {
  chunks?: DocumentChunk[]
}

export interface InspectResponse {
  query: string
  embedding: { dimensions: number; preview: number[] }
  results: SearchResult[]
  context: string
  sources: ConverseSource[]
  systemPrompt: string
  latencyMs: { embed: number; retrieve: number; total: number }
}

export const useDocumentsStore = defineStore('documents', () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBaseUrl

  const documents = ref<Document[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all documents
  async function fetchDocuments() {
    loading.value = true
    try {
      const response = await $fetch<Document[]>(`${apiUrl}/documents`)
      documents.value = response
    } catch (err) {
      error.value = 'Failed to fetch documents'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Create document from text
  async function createDocument(data: {
    title: string
    content: string
    sourceType: string
  }) {
    try {
      const response = await $fetch<Document>(`${apiUrl}/documents`, {
        method: 'POST',
        body: data,
      })
      await fetchDocuments()
      return response
    } catch (err) {
      error.value = 'Failed to create document'
      throw err
    }
  }

  // Upload file
  async function uploadFile(file: File) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      await $fetch(`${apiUrl}/documents/upload`, {
        method: 'POST',
        body: formData,
      })
      await fetchDocuments()
    } catch (err) {
      error.value = 'Failed to upload file'
      throw err
    }
  }

  // Search documents (API returns a JSON array of results)
  async function search(query: string, limit = 5): Promise<SearchResult[]> {
    try {
      return await $fetch<SearchResult[]>(`${apiUrl}/search`, {
        method: 'POST',
        body: { query, limit },
      })
    } catch (err) {
      error.value = 'Search failed'
      return []
    }
  }

  async function converse(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    limit = 8,
  ): Promise<ConverseResponse> {
    return await $fetch<ConverseResponse>(`${apiUrl}/search/converse`, {
      method: 'POST',
      body: { messages, limit },
      timeout: 210_000,
    })
  }

  /** Planner + optional vector search + answer (agent-style) */
  async function agentChat(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    limit = 8,
    userId?: string | null,
  ): Promise<AgentChatResponse> {
    return await $fetch<AgentChatResponse>(`${apiUrl}/agent/chat`, {
      method: 'POST',
      body: { messages, limit, userId: userId || undefined },
      timeout: 210_000,
    })
  }

  // RAG query
  async function ragQuery(query: string, limit = 5) {
    try {
      const response = await $fetch(`${apiUrl}/search/rag`, {
        method: 'POST',
        body: { query, limit },
      })
      return response
    } catch (err) {
      error.value = 'RAG query failed'
      throw err
    }
  }

  async function fetchDocument(id: string): Promise<DocumentDetail> {
    return await $fetch<DocumentDetail>(`${apiUrl}/documents/${id}`)
  }

  async function deleteDocument(id: string): Promise<void> {
    await $fetch(`${apiUrl}/documents/${id}`, { method: 'DELETE' })
    documents.value = documents.value.filter((d) => d.id !== id)
  }

  async function reprocessDocument(id: string): Promise<void> {
    await $fetch(`${apiUrl}/documents/${id}/reprocess`, { method: 'POST' })
  }

  async function inspect(query: string, limit = 5): Promise<InspectResponse> {
    return await $fetch<InspectResponse>(`${apiUrl}/search/inspect`, {
      method: 'POST',
      body: { query, limit },
    })
  }

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    fetchDocument,
    deleteDocument,
    reprocessDocument,
    createDocument,
    uploadFile,
    search,
    ragQuery,
    inspect,
    converse,
    agentChat,
  }
})
