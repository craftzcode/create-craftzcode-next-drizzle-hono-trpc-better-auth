import Link from 'next/link'

import { RiPulseAiLine } from '@remixicon/react'

export const Logo = () => {
  return (
    <Link href='/' className='flex items-center gap-2'>
      <RiPulseAiLine size={16} />
      <span className='text-sm font-semibold'>RHU II System</span>
    </Link>
  )
}
