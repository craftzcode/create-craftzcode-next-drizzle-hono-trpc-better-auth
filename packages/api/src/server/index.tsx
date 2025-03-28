import 'server-only' // <-- ensure this file cannot be imported from the client

import { cache } from 'react'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createTRPCClient, httpLink } from '@trpc/client'
import { createTRPCOptionsProxy, TRPCQueryOptions } from '@trpc/tanstack-react-query'

import { makeQueryClient } from '../client/query-client'
import { createTRPCContext } from '../index'
import { appRouter } from './routers/index'

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient)
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient
})
// If your router is on a separate server, pass a client:
createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [httpLink({ url: '...' })]
  }),
  queryClient: getQueryClient
})

// You can also create a prefetch and HydrateClient helper functions to make it a bit more consice and reusable
// export function HydrateClient(props: { children: React.ReactNode }) {
//   const queryClient = getQueryClient();
//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       {props.children}
//     </HydrationBoundary>
//   );
// }
// export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
//   queryOptions: T,
// ) {
//   const queryClient = getQueryClient();
//   if (queryOptions.queryKey[1]?.type === 'infinite') {
//     void queryClient.prefetchInfiniteQuery(queryOptions as any);
//   } else {
//     void queryClient.prefetchQuery(queryOptions);
//   }
// }

// Then you can use it like this
// import { HydrateClient, prefetch, trpc } from '~/trpc/server';
// function Home() {
//   prefetch(
//     trpc.hello.queryOptions({
//       /** input */
//     }),
//   );
//   return (
//     <HydrateClient>
//       <div>...</div>
//       {/** ... */}
//       <ClientGreeting />
//     </HydrateClient>
//   );
// }
