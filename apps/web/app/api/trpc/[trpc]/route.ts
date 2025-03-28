import { appRouter, createTRPCContext } from '@rhu-ii/api'

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext
  })
export { handler as GET, handler as POST }
