'use client'
import { useCallback, useState } from 'react'
import type { MouseEventHandler, ReactNode } from 'react'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover'
import { useDebounce } from '@uidotdev/usehooks'
import { ChevronRight } from 'lucide-react'
import { useAppShellContext } from '../use-app-shell'
import s from './group.module.scss'
import { FlyoutMenu } from './flyout'
import { StaticMenu } from './static-menu'

interface NavigationItemProps {
  label: string
  icon: ReactNode
  className?: string
  defaultOpen?: boolean
  children?: ReactNode
}

export function NavigationGroup({ label, icon, children }: NavigationItemProps) {
  const { leftPanelExpanded } = useAppShellContext()
  const [flyoverOpen, setFlyoverOpen] = useState(false)
  const [staticOpen, setStaticOpen] = useState(true)
  const debouncedFlyoverOpen = useDebounce(flyoverOpen, 200)

  /**
   * Control mechanism of the popover, used in conjuction with the "open" property on the Popover component
   */
  const handleOnOpenChange = (open: boolean) => {
    setFlyoverOpen(open)
  }

  /**
   * We only want to toggle the static menu if the left panel is expanded
   */
  const handleOnTriggerClick = useCallback(() => {
    if (leftPanelExpanded) {
      setStaticOpen((prevState) => !prevState)
    }
  }, [leftPanelExpanded])

  const handleOnTriggerMouseOver = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    // Dont open the flyover if the static menu is open (when the left panel is expanded)
    // for all other scenarios open the flyover
    if (staticOpen && leftPanelExpanded) return
    setFlyoverOpen(true)
  }, [staticOpen, leftPanelExpanded])

  const handleOnTriggerMouseLeave = useCallback(() => {
    setFlyoverOpen(false)
  }, [])

  const handleOnContentMouseEnter = () => {
    setFlyoverOpen(true)
  }

  const handleOnContentMouseLeave = () => {
    setFlyoverOpen(false)
  }

  const shouldShowStaticMenu = leftPanelExpanded && staticOpen

  return (
    <Popover open={debouncedFlyoverOpen} onOpenChange={handleOnOpenChange}>
      <li className={s.group}>
        <PopoverTrigger asChild>
          <button
            className={s.trigger}
            onClick={handleOnTriggerClick}
            onMouseOver={handleOnTriggerMouseOver}
            onMouseLeave={handleOnTriggerMouseLeave}
          >
            {icon}
            <span className={s.label}>{label}</span>
            <ChevronRight className={s.caret} data-expanded={shouldShowStaticMenu ? 'true' : 'false'} />
          </button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent
            className={s.flyout}
            side='right'
            align='center'
            sideOffset={12}
            onMouseEnter={handleOnContentMouseEnter}
            onMouseLeave={handleOnContentMouseLeave}
          >
            <FlyoutMenu>{children}</FlyoutMenu>
          </PopoverContent>
        </PopoverPortal>
        <StaticMenu expanded={shouldShowStaticMenu}>{children}</StaticMenu>
      </li>
    </Popover>
  )
}
