import { cache } from 'react'

import { auth } from '@rhu-ii/auth'
import type { Context as HonoContext } from 'hono'

/**
 * Creates a tRPC context from a Hono context
 *
 * @description
 * This function creates a tRPC context by extracting session information from
 * the Hono context. It combines the web framework's context (Hono) with tRPC's
 * context system to enable authenticated API routes.
 *
 * Performance considerations:
 * - Using server-side session fetching avoids redundant client-side network requests
 * - Direct API access to auth.api.getSession is more efficient than client-side fetching
 * - The React cache function memoizes context creation to prevent duplicate session lookups
 *   for the same request, reducing database/auth provider load
 *
 * The cache wrapper ensures that within a single React Server Component render pass,
 * multiple calls to createTRPCContext with the same Hono context will reuse the
 * previously computed result rather than making duplicate auth verification calls.
 *
 * @param c - The Hono context from the HTTP request
 * @returns A context object containing the user session (if authenticated)
 */
export const createTRPCContext = cache(async (c: HonoContext) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers
  })

  console.log({
    Context: session
  })

  return { session }
})

export type Context = Awaited<ReturnType<typeof createTRPCContext>>
