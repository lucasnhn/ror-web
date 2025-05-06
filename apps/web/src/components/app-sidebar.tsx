'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger,
} from '@/components/shadcn/sidebar'
import { Boxes, CornerUpLeft, CircleHelp, ChevronRight, User } from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/shadcn/collapsible'
import { ColorScheme } from '@/utils/dark-mode'
import { ThemeToggle } from './layout/app-shell/theme-toggle'
import Image from 'next/image'
import { Avatar } from './shadcn/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Layer } from '@ror/react'
import Link from 'next/link'
import { Profile } from './layout/app-shell/profile'
import { ProfileServer } from './layout/app-shell/profile-server'

type SidebarItem = { title: string } | { title: string; url: string }

interface Section {
  title: string
  icon: React.ElementType
  isActive: boolean
  items: SidebarItem[]
}

/*
 * Add sections as they are created
 */
const sections: Section[] = [
  // {
  //   title: "Favorites",
  //   icon: Star,
  //   isActive: true,
  //   items: [
  //     {
  //       title: "No current favorites",
  //     }
  //   ]
  // },
  // {
  //   title: "Overview",
  //   icon: House,
  //   isActive: true,
  //   items: [
  //     {
  //       title: "Overview",
  //       url: "#",
  //     }
  //   ]
  // },
  {
    title: 'Clusters',
    icon: Boxes,
    isActive: true,
    items: [
      {
        title: 'Clusters',
        url: '/clusters',
      },
    ],
  },
  // {
  //   title: "Statistics",
  //   icon: ChartColumn,
  //   isActive: true,
  //   items: [
  //     {
  //       title: "Metrics",
  //       url: "#",
  //     }
  //   ]
  // },
  // {
  //   title: "Economy",
  //   icon: CircleDollarSign,
  //   isActive: true,
  //   items: [
  //     {
  //       title: "Price list",
  //       url: "#",
  //     }
  //   ]
  // },
  // {
  //   title: "Administration",
  //   icon: Settings2,
  //   isActive: true,
  //   items: [
  //     {
  //       title: "Data centers",
  //       url: "#",
  //     },
  //     {
  //       title: "Policy reports",
  //       url: "#",
  //     },
  //     {
  //       title: "Admin price list",
  //       url: "#",
  //     },
  //     {
  //       title: "Projects",
  //       url: "#",
  //     },
  //     {
  //       title: "Vulnerability reports",
  //       url: "#",
  //     },
  //     {
  //       title: "Workspaces",
  //       url: "#",
  //     },
  //   ]
  // },
  {
    title: 'Help',
    icon: CircleHelp,
    isActive: true,
    items: [
      {
        title: 'Documentation',
        url: 'https://docs.nhn.no/',
      },
      // {
      //   title: "About",
      //   url: "#",
      // },
      // {
      //   title: "Release notes",
      //   url: "#",
      // }
    ],
  },
  {
    title: 'Legacy',
    icon: CornerUpLeft,
    isActive: true,
    items: [
      {
        title: 'Old ROR',
        url: 'https://ror.nhn.no/',
      },
    ],
  },
]

interface AppSidebarProps {
  colorScheme: ColorScheme
}

export function AppSidebar({ colorScheme }: AppSidebarProps) {
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='flex flex-row items-center'>
        <Image src='/logo.svg' alt='Logo' width={40} height={40} className='w-10 h-fit scale-100' />
        <h1 className='text-4xl text-blue-900 dark:text-inherit font-semibold group-data-[collapsible=icon]:hidden'>
          ROR
        </h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className=''>
          <SidebarMenu>
            {sections.map((section, index) => (
              <Collapsible asChild defaultOpen={section.isActive} className='group/collapsible' key={index}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={section.title}>
                      <section.icon />
                      <span>{section.title}</span>
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {section.items.map((item, index) => (
                        <SidebarMenuSubItem key={index}>
                          <SidebarMenuButton asChild>
                            {'url' in item ? <Link href={item.url}>{item.title}</Link> : <span>{item.title}</span>}
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='mb-2 flex flex-row group-data-[collapsible=icon]:flex-col items-center justify-between'>
        <Layer level={0}>
          <Avatar className='bg-[var(--r-layer)] flex items-center justify-center'>
            {/* <AvatarFallback><User /></AvatarFallback> */}
            <ProfileServer />
          </Avatar>
        </Layer>

        <div className='flex flex-row group-data-[collapsible=icon]:flex-col items-center gap-2'>
          <ThemeToggle colorScheme={colorScheme} />
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
