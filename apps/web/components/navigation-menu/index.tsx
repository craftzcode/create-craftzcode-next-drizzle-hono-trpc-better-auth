import { DesktopNav } from './desktop-nav'
import { MobileNav } from './mobile-nav'

export const NavigationMenu = () => {
  return (
    <header className='p-2'>
      <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 border-input sticky top-0 z-50 rounded-md border shadow-xs backdrop-blur'>
        <div className='flex h-13 items-center px-4'>
          <DesktopNav />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
