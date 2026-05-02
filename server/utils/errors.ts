import { createError } from 'h3'

export function notFound(message = 'Not found') {
  return createError({ statusCode: 404, statusMessage: message })
}

export function badRequest(message = 'Bad request') {
  return createError({ statusCode: 400, statusMessage: message })
}

export function internalError(message = 'Internal server error') {
  return createError({ statusCode: 500, statusMessage: message })
}
