import { createAuthClient } from 'better-auth/react'

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  /** the base url of the server (optional if you're using the same domain) */
  baseURL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
})

export const { signIn, signUp, useSession } = authClient
