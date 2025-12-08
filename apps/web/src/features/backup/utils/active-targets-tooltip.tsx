import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/shadcn/tooltip'
import Link from 'next/link'

interface IdItem {
  id: string
  href?: string
}

interface IdListTooltipProps {
  ids: (string | IdItem)[]
  label: string
  triggerText?: string
  triggerElement?: React.ReactNode
}

export const IdListTooltip = ({ ids, label, triggerText, triggerElement }: IdListTooltipProps) => {
  const displayText = triggerText || `View ${label.toLowerCase()}`

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{triggerElement || <span className='underline '>{displayText}</span>}</TooltipTrigger>
        <TooltipContent>
          <div className='space-y-2 max-w-xs'>
            <div className='font-semibold text-sm'>{label}:</div>
            <div className='space-y-1'>
              {ids.map((item, index) => {
                const id = typeof item === 'string' ? item : item.id
                const href = typeof item === 'string' ? undefined : item.href

                if (href) {
                  return (
                    <Link
                      key={index}
                      href={href}
                      className='font-mono text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline block'
                    >
                      {id}
                    </Link>
                  )
                }
                return (
                  <div key={index} className='font-mono text-xs'>
                    {id}
                  </div>
                )
              })}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Keep the old component for backward compatibility
export const ActiveTargetsTooltip = ({
  ids,
  triggerElement,
}: {
  ids: (string | IdItem)[]
  triggerElement?: React.ReactNode
}) => {
  return <IdListTooltip ids={ids} label='Active Targets' triggerElement={triggerElement} />
}
