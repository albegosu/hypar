import { findAll } from '../../utils/documents.service'

export default defineEventHandler(async () => {
  return findAll()
})
