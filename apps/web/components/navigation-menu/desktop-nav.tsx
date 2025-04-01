import Link from 'next/link'

import { Button } from '@craftzcode/ui/components/button'
import { RiFileTextLine, RiSettingsLine } from '@remixicon/react'

import { DesktopMainNav } from './desktop-main-nav'
import { Logo } from './logo'
import { UserMenu } from './user-menu'

export const DesktopNav = () => {
  const controlPanel = [
    {
      icon: <RiFileTextLine />,
      href: '/audit-logs'
    },
    {
      icon: <RiSettingsLine />,
      href: '/settings'
    }
  ]
  return (
    <div className='hidden w-full items-center justify-between space-x-4 lg:flex'>
      <Logo />
      <DesktopMainNav />
      <div className='flex items-center space-x-4'>
        {controlPanel.map((item, index) => (
          <Button key={index} size='icon' variant='outline' asChild>
            <Link href={item.href}>{item.icon}</Link>
          </Button>
        ))}
        <UserMenu />
      </div>
    </div>
  )
}
