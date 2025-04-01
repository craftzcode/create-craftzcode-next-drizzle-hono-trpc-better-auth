import superjson from 'superjson'

import { initTRPC, TRPCError } from '@trpc/server'

import { Context } from './lib/context'

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson
})
// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const publicProcedure = t.procedure

// // Middleware to check if user is authenticated
// const isAuthed = t.middleware(({ ctx, next }) => {
//   if (!ctx.session || !ctx.session.user) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' })
//   }
//   return next({
//     ctx: {
//       // Add user information to context
//       session: ctx.session,
//       user: ctx.session.user
//     }
//   })
// })

// // Protected procedure that requires authentication
// export const protectedProcedure = t.procedure.use(isAuthed)

/**
 * Protected procedure middleware for authenticated routes
 *
 * @description
 * This middleware ensures that the request has a valid user session before proceeding.
 * It throws an UNAUTHORIZED error if no session exists, preventing unauthorized access
 * to protected API endpoints.
 *
 * The session is obtained from the tRPC context, which is created in `createTRPCContext`
 * (lib/context.ts). There, the session is extracted from the request headers using
 * the auth API: `auth.api.getSession({ headers: c.req.raw.headers })`.
 *
 * Note that `c.req.raw.headers` comes from the Hono context (`c: HonoContext`) that is passed to
 * `createTRPCContext`. This creates a bridge between Hono's web framework context and tRPC's
 * context system, allowing session data to flow from the HTTP request (via Hono) into the
 * tRPC procedure handlers.
 *
 * @example
 * // Creating a protected route that requires authentication
 * export const userRouter = createTRPCRouter({
 *   // This route can only be accessed by authenticated users
 *   getProfile: protectedProcedure
 *     .query(({ ctx }) => {
 *       // ctx.session is guaranteed to exist here
 *       const userId = ctx.session.user.id;
 *       return getUserProfile(userId);
 *     }),
 *
 *   // Another protected route with input validation
 *   updateProfile: protectedProcedure
 *     .input(z.object({ name: z.string() }))
 *     .mutation(({ ctx, input }) => {
 *       const userId = ctx.session.user.id;
 *       return updateUserData(userId, input);
 *     })
 * });
 *
 * @param {Object} params - The procedure parameters
 * @param {Context} params.ctx - The tRPC context containing session (if authenticated)
 * @param {Function} params.next - Function to call the next middleware or resolver
 * @throws {TRPCError} Throws with code 'UNAUTHORIZED' if no session exists
 * @returns Result of the next middleware with the session in context
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session
    }
  })
})
