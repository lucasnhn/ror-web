'use client'
import { AriaAttributes, HTMLAttributes, isValidElement, ReactNode } from 'react'
import { Tile } from './tile'
import { MetricsWheel } from './metrics-wheel'
import clsx from 'clsx'
import { XIcon } from 'lucide-react'

interface BaseMetricsCardProps extends HTMLAttributes<HTMLElement> {
  /**
   * Specify the label for the metrics card
   */
  'ariaLabel'?: AriaAttributes['aria-label']

  /**
   * Specify an optional className to be applied to the container node
   */
  className?: string

  /**
   * Specify the item for the metrics card
   */
  item?: MetricsCardItem

  /**
   * Specify children if you want to override default layout
   */
  children?: ReactNode | undefined

  /**
   * Indicates whether the card is in edit mode
   * @default false
   */
  shouldEdit?: boolean

  /**
   * Function to handle removal
   */
  onRemove?: () => void
}

interface MetricsCardWithItemProps {
  item: MetricsCardItem
}

interface MetricsCardWithChildrenProps {
  children: ReactNode
}

export type MetricsCardProps = BaseMetricsCardProps & (MetricsCardWithItemProps | MetricsCardWithChildrenProps)

function isMetricsCardWithItemProps(props: MetricsCardProps): props is BaseMetricsCardProps & MetricsCardWithItemProps {
  return 'item' in props && props.item !== undefined
}

function isMetricsCardWithChildrenProps(props: MetricsCardProps): props is BaseMetricsCardProps & MetricsCardWithChildrenProps {
  return 'children' in props && isValidElement(props.children)
}

export type MetricType = 'wheel' | 'removelaterwhenyouhavemore'

export interface MetricsCardItem {
  id: string
  typeId: number
  title: string
  description?: string
  linkText?: string
  linkPath?: string
  type: MetricType
  wheelPart?: number
  wheelWhole?: number
  wheelPercentage?: number
  wheelLabel?: string
  wheelIndicator?: boolean
  inverted?: boolean
}

const getChart = (item: MetricsCardItem) => {
  switch (item.type) {
    case 'wheel':
      return (
        <MetricsWheel
          part={item.wheelPart}
          whole={item.wheelWhole}
          percentage={item.wheelPercentage}
          label={item.wheelLabel}
          indicator={item.wheelIndicator}
          inverted={item.inverted}
        />
      )
    default:
      return null
  }
}

const getLayout = (item: MetricsCardItem) => {
  switch (item.type) {
    case 'wheel':
      return (
        <div className='r-metrics-card__content'>
          <div className='r-metrics-card__textContent'>
            <h3 className='r-metrics-card__title'>{item.title}</h3>
            <p className='r-metrics-card__description'>{item.description}</p>
            {item.linkText && (
              <a className='r-metrics-card__linkText' href={item.linkPath}>
                {item.linkText}
              </a>
            )}
          </div>
          <div>{getChart(item)}</div>
        </div>
      )
    default:
      return null
  }
}

export function MetricsCard(props: MetricsCardProps) {
  const { className, shouldEdit = false, onRemove } = props
  const classes = clsx(`r-metrics-card`, className)

  const handleOnRemove = () => {
    if (typeof onRemove === 'function') {
      onRemove()
    }
  }

  if (isMetricsCardWithChildrenProps(props)) {
    return (
      <Tile className={classes}>
        <div className='r-metrics-card__container'>
          {props.children}
          {shouldEdit && (
            <button onClick={handleOnRemove} className='r-metrics-card__remove-button' aria-label='Remove Metric'>
              <XIcon />
            </button>
          )}
        </div>
      </Tile>
    )
  } else if (isMetricsCardWithItemProps(props)) {
    const layout = getLayout(props.item)
    return (
      <Tile className={classes}>
        <div className='r-metrics-card__container'>
          {layout}
          {shouldEdit && (
            <button onClick={handleOnRemove} className='r-metrics-card__remove-button' aria-label='Remove Metric'>
              <XIcon />
            </button>
          )}
        </div>
      </Tile>
    )
  }

  throw new Error('MetricsCard requires either an item or children')
}
