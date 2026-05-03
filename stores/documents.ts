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

export interface ConverseSource {
  chunkId: string
  documentId: string
  documentTitle: string
  score: number
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

/** Response from POST /api/documents (async ingest started). */
export interface IngestStartResponse {
  documentId: string
  title: string
  runId: string
  status: 'processing'
}

export const useDocumentsStore = defineStore('documents', () => {
  const documents = ref<Document[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDocuments() {
    loading.value = true
    try {
      const response = await $fetch<Document[]>('/api/documents')
      documents.value = response
    } catch (err) {
      error.value = 'Failed to fetch documents'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createDocument(data: {
    title: string
    content: string
    sourceType: string
  }): Promise<IngestStartResponse> {
    try {
      const response = await $fetch<IngestStartResponse>('/api/documents', {
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

  async function uploadFile(file: File): Promise<{ documentId: string; runId: string }> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await $fetch<{ documentId: string; runId: string; title: string; status: string }>(
        '/api/documents/upload',
        { method: 'POST', body: formData },
      )
      return { documentId: response.documentId, runId: response.runId }
    } catch (err) {
      error.value = 'Failed to upload file'
      throw err
    }
  }

  async function search(query: string, limit = 5): Promise<SearchResult[]> {
    try {
      return await $fetch<SearchResult[]>('/api/search', {
        method: 'POST',
        body: { query, limit },
      })
    } catch (err) {
      error.value = 'Search failed'
      return []
    }
  }

  async function ragQuery(query: string, limit = 5) {
    try {
      return await $fetch('/api/search/rag', {
        method: 'POST',
        body: { query, limit },
      })
    } catch (err) {
      error.value = 'RAG query failed'
      throw err
    }
  }

  async function fetchDocument(id: string): Promise<DocumentDetail> {
    return await $fetch<DocumentDetail>(`/api/documents/${id}`)
  }

  async function deleteDocument(id: string): Promise<void> {
    await $fetch(`/api/documents/${id}`, { method: 'DELETE' })
    documents.value = documents.value.filter((d) => d.id !== id)
  }

  async function reprocessDocument(id: string): Promise<{ documentId: string; runId: string }> {
    return await $fetch<{ documentId: string; runId: string }>(`/api/documents/${id}/reprocess`, { method: 'POST' })
  }

  async function inspect(query: string, limit = 5): Promise<InspectResponse> {
    return await $fetch<InspectResponse>('/api/search/inspect', {
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
  }
})
