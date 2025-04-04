'use client'

import { useTRPC } from '@craftzcode/api/client'

import { useQuery } from '@tanstack/react-query'

export const ClientGreeting = () => {
  const trpc = useTRPC()
  const greeting = useQuery(trpc.hello.queryOptions({ text: 'craftzcode' }))
  if (!greeting.data) return <div>Loading...</div>
  return <div>{greeting.data.greeting}</div>
}
