'use client'

import { usePathname } from 'next/navigation'

interface MainProps {
  children: React.ReactNode
}

/**
 * Main component provides a consistent layout wrapper for page content
 * with automatic title generation based on the current pathname.
 *
 * @param {MainProps} props - Component properties
 * @param {React.ReactNode} props.children - Child content to render inside the main container
 */
export const Main = ({ children }: MainProps) => {
  const pathname = usePathname()

  // Convert pathname to a properly capitalized title:
  // - For root path ('/'), display 'Dashboard'
  // - For other paths, capitalize the first letter and use the rest as is
  // Example: '/users' becomes 'Users'
  const title =
    pathname === '/' || !pathname
      ? 'Dashboard'
      : pathname.substring(1).charAt(0).toUpperCase() + pathname.substring(2)

  return (
    <main className='px-2 pt-1 pb-2'>
      <div className='border-border rounded-md border shadow-xs'>
        <div className='border-border border-b p-4'>
          <h1 className='font-medium'>{title}</h1>
        </div>
        {children}
      </div>
    </main>
  )
}
