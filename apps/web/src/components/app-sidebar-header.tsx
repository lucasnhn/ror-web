import { SidebarHeader } from './shadcn/sidebar'
import Image from 'next/image'

export function AppSidebarHeader() {
  return (
    <SidebarHeader className='flex flex-row items-center'>
      <Image src='/logo.svg' alt='Logo' width={40} height={40} className='w-10 h-fit scale-100' />
      <h1 className='text-4xl text-blue-900 dark:text-inherit font-semibold group-data-[collapsible=icon]:hidden'>
        ROR
      </h1>
    </SidebarHeader>
  )
}
