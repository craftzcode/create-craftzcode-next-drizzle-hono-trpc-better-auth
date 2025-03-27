import { Logo } from './logo'
import { MobileMainNav } from './mobile-main-nav'
import { UserMenu } from './user-menu'

export const MobileNav = () => {
  return (
    <div className='flex w-full items-center justify-between gap-4 lg:hidden'>
      <Logo />
      <div className='flex items-center gap-2'>
        <MobileMainNav />
        <UserMenu />
      </div>
    </div>
  )
}
