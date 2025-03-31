import { trpcServer } from '@hono/trpc-server' // Deno 'npm:@hono/trpc-server'
import { Hono } from 'hono'

import { appRouter } from './server/routers'

/**
 * We use basePath('/api') to prefix all routes with '/api'.
 * This ensures our API endpoints are properly namespaced under /api/
 * (e.g., localhost:3000/api/status instead of localhost:3000/status).
 *
 * Benefits:
 * - Clear separation between API routes and other routes (like frontend pages)
 * - Better organization and maintainability
 * - Follows REST API best practices for route structuring
 */
const app = new Hono().basePath('/api')

app.use(
  '/trpc/*',
  trpcServer({
    /**
     * The endpoint parameter defines the full URL path for tRPC API requests.
     * We set it to '/api/trpc' to match our basePath prefix + the trpc route.
     *
     * This ensures that:
     * - All tRPC requests are properly routed to the correct handler
     * - The path matches our basePath('/api') configuration
     * - Client-side tRPC calls will connect to the correct endpoint URL
     */
    endpoint: '/api/trpc',
    router: appRouter
  })
)

app.get('/status', c => {
  return c.json({
    message: 'Hono Router: Hono + tRPC'
  })
})

export default app
