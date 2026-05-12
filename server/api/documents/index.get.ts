import { findAll } from '../../utils/documents.service'

export default defineEventHandler(async (event) => {
  const userId = requireSessionUserId(event)
  return findAll(userId)
})
