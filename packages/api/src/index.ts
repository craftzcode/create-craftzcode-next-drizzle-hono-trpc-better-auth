import { trpcServer } from '@hono/trpc-server' // Deno 'npm:@hono/trpc-server'
import { Hono } from 'hono'

import { appRouter } from './server/routers'
import { createTRPCContext } from './trpc'

const app = new Hono().basePath('/api')

app.use(
  '/trpc/*',
  trpcServer({
    endpoint: '/api/trpc',
    router: appRouter,
    createContext: createTRPCContext
  })
)

app.get('/status', c => {
  return c.json({
    message: 'Hono Router: Hono + tRPC'
  })
})

export default app
