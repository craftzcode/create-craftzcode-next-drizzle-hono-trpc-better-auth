import { getQueryClient, trpc } from '@rhu-ii/api/server'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { ClientGreeting } from '../components/client-greeting'

export default async function Home() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.hello.queryOptions({
      text: 'craftzcode'
    })
  )

  return (
    <div className='space-y-4 p-4'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ClientGreeting />
      </HydrationBoundary>
    </div>
  )
}
