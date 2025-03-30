import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../../trpc'

export const appRouter = createTRPCRouter({
  status: publicProcedure.query(() => {
    return {
      message: 'tRPC Router: Hono + tRPC'
    }
  }),
  hello: publicProcedure
    .input(
      z.object({
        text: z.string()
      })
    )
    .query(opts => {
      return {
        greeting: `hello ${opts.input.text}`
      }
    })
})
// export type definition of API
export type AppRouter = typeof appRouter
