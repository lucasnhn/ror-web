import { cn } from '@/utils/clsxm'
import { ReactNode, useState } from 'react'
import { Button } from '../shadcn/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FieldValues, Path, UseFormTrigger } from 'react-hook-form'
import { WizardContentType } from '@/types/wizard-content-type'

interface WizardProps<TFieldValues extends FieldValues> {
  className?: string
  content: WizardContentType[]
  trigger: UseFormTrigger<TFieldValues>
  stepFields: Array<Array<Path<TFieldValues>>>
  summary: ReactNode
}

interface WizardItemProps {
  title: string
  circleNum: number
  itemState: ItemState
  onClick?: () => void
}

type ItemState = 'inactive' | 'active' | 'wasActive'

const HorizontalLine = ({ className }: { className?: string }) => (
  <span className={cn('mx-4 h-px w-16 border border-b rounded-xs', className)} />
)

const Circle = ({ className, circleNum }: { className?: string; circleNum: number }) => (
  <div className={cn('rounded-full border h-10 w-10 flex justify-center items-center', className)}>{circleNum}</div>
)

const StepTitle = ({ title, className }: { title: string; className?: string }) => <p className={className}>{title}</p>

function getItemState(index: number, active: number, maxReached: number): ItemState {
  if (index === active) return 'active'
  if (index <= maxReached) return 'wasActive'
  return 'inactive'
}

const WizardItem = ({ title, circleNum, itemState, onClick }: WizardItemProps) => {
  const isActive = itemState === 'active'
  const isReached = itemState !== 'inactive'
  const circleClass = cn('mr-4 border-3 font-bold', isReached && 'border-blue-600', isActive && 'bg-blue-600')
  const titleClass = cn(isReached && 'text-blue-600')

  return (
    <button
      type='button'
      onClick={isReached ? onClick : undefined}
      disabled={!isReached}
      aria-disabled={!isReached}
      aria-current={isActive ? 'step' : undefined}
      className={cn('flex items-center text-left', isReached ? 'cursor-pointer' : 'cursor-not-allowed')}
    >
      <Circle circleNum={circleNum} className={circleClass} />
      <StepTitle title={title} className={titleClass} />
    </button>
  )
}

export const Wizard = <TFieldValues extends FieldValues>({
  className,
  content,
  trigger,
  stepFields,
  summary,
}: WizardProps<TFieldValues>) => {
  const [active, setActive] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  if (content.length === 0) return null

  const lastIndex = content.length - 1
  const safeActive = Math.min(active, lastIndex)

  const goNext = async () => {
    const fields = stepFields[safeActive] ?? []
    const ok = fields.length === 0 ? true : await trigger(fields, { shouldFocus: true })
    if (!ok) return

    const next = Math.min(safeActive + 1, lastIndex)
    setActive(next)
    setMaxReached((m) => Math.max(m, next))
  }

  const goPrev = () => {
    setActive((p) => Math.max(0, Math.min(p - 1, lastIndex)))
  }

  const goToStep = (index: number) => {
    if (index <= maxReached) setActive(Math.min(index, lastIndex))
  }

  return (
    <div className={cn(className, 'py-4')}>
      <div className='flex px-12 pb-4 border-b justify-between'>
        <div className='flex flex-wrap gap-y-6'>
          {content.map((c, index) => {
            const state = getItemState(index, safeActive, maxReached)

            return (
              <div key={index} className='flex items-center'>
                <WizardItem
                  key={index}
                  title={c.title}
                  circleNum={index + 1}
                  itemState={state}
                  onClick={() => goToStep(index)}
                  aria-label={`Step ${index + 1}: ${c.title}`}
                />
                {index !== content.length - 1 && (
                  <HorizontalLine className={cn(state !== 'inactive' && 'border-blue-600')} />
                )}
              </div>
            )
          })}
        </div>
        <Button onClick={() => setShowSummary(!showSummary)}>{showSummary ? 'Hide summary' : 'Show summary'}</Button>
      </div>

      <div className='p-12'>
        <div className='flex flex-row gap-24 justify-center'>
          <span>{content[safeActive]?.wizardContent}</span>
          {showSummary && safeActive !== content.length - 1 && summary}
        </div>

        <div className='flex gap-4 justify-center mt-16'>
          {safeActive > 0 && (
            <Button variant='outline' type='button' aria-label='Previous step' onClick={goPrev}>
              <ArrowLeft />
            </Button>
          )}
          {safeActive < content.length - 1 && (
            <Button type='button' aria-label='Next step' onClick={goNext}>
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
