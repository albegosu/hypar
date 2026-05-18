import { randomUUID } from 'node:crypto'

export default defineEventHandler((event) => {
  const incoming = getHeader(event, 'x-request-id')
  const requestId = incoming?.trim() || randomUUID()
  event.context.requestId = requestId
  setHeader(event, 'x-request-id', requestId)
})
