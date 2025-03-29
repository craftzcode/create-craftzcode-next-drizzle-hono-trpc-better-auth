import { createTRPCContext } from '@rhu-ii/api'
import { appRouter } from '@rhu-ii/api/server/routers'

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext
  })
export { handler as GET, handler as POST }
