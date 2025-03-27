'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { RiBox3Line, RiGroupLine, RiShapeLine, RiTruckLine } from '@remixicon/react'
import { Button } from '@rhu-ii/ui/components/button'
import { cn } from '@rhu-ii/ui/lib/utils'

export const DesktopMainNav = () => {
  const pathname = usePathname()

  const navItems = [
    {
      icon: <RiShapeLine />,
      name: 'Dashboard',
      href: '/'
    },
    {
      icon: <RiBox3Line />,
      name: 'Inventory',
      href: '/inventory'
    },
    {
      icon: <RiGroupLine />,
      name: 'Patients',
      href: '/patients'
    },
    {
      icon: <RiTruckLine />,
      name: 'Suppliers',
      href: '/suppliers'
    }
  ]

  return (
    <nav className='flex items-center space-x-4'>
      {navItems.map(item => {
        const isActive = pathname === item.href

        return (
          <Button
            key={item.name}
            asChild
            size='sm'
            variant={isActive ? 'default' : 'outline'}
            className={cn(isActive ? 'text-primary-foreground' : 'text-muted-foreground')}
          >
            <Link href={item.href} className='flex items-center gap-2'>
              {item.icon}
              {item.name}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
