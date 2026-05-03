import { findAll } from '../../utils/documents.service'

export default defineEventHandler(async (event) => {
  const userId =
    getHeader(event, 'x-user-id') ||
    (getQuery(event).userId as string | undefined)
  return findAll(userId)
})
