'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  RiBox3Line,
  RiFileTextLine,
  RiFunctionLine,
  RiGroupLine,
  RiSettingsLine,
  RiShapeLine,
  RiTruckLine
} from '@remixicon/react'
import { Button } from '@rhu-ii/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@rhu-ii/ui/components/dropdown-menu'
import { cn } from '@rhu-ii/ui/lib/utils'

export const MobileMainNav = () => {
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
    },
    {
      icon: <RiFileTextLine />,
      name: 'Audit Logs',
      href: '/audit-logs'
    },
    {
      icon: <RiSettingsLine />,
      name: 'Settings',
      href: '/settings'
    }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='outline'>
          <RiFunctionLine />
          <span className='sr-only'>Toggle Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40' align='end'>
        {navItems.map(item => {
          const isActive = pathname === item.href

          return (
            <DropdownMenuItem
              key={item.name}
              className={cn(isActive ? 'text-foreground' : 'text-muted-foreground')}
              asChild
            >
              <Link href={item.href} className='flex items-center gap-2'>
                {item.icon}
                {item.name}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
