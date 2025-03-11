// 'use client'

import { AriaAttributes, HTMLAttributes, ReactNode } from 'react'
import { Tile } from './tile'
import { MetricsWheel } from './metrics-wheel'
import { CrossIcon } from '../../../../apps/web/components/icons'
import clsx from 'clsx'

export interface MetricsCardProps extends HTMLAttributes<HTMLElement> {
    /**
     * Specify the label for the metrics card 
     */
    'aria-label'?: AriaAttributes['aria-label']

    /**
     * Specify an optional className to be applied to the container node
     * @default ""
     */
    className?: string

    /**
     * Specify the item for the metrics card
     * @default null
     */
    item?: DashboardItem,

    /**
     * Specify children if you want to override default layout
     * @default null
     */
    children?: ReactNode | undefined

    /**
     * Indicates whether the card is in edit mode
     */
    shouldEdit?: boolean

    /**
     * Function to handle removal when the cross is clicked
     */
    onRemove?: () => void
}

type MetricType = 'wheel' | 'removelaterwhenyouhavemore'

interface DashboardItem {
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
  
const getChart = (item: DashboardItem) => {
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

const getLayout = (item: DashboardItem) => {
    switch (item.type) {
        case 'wheel':
            return (
                <div className="r-metrics-card__content">
                    <div className="r-metrics-card__textContent">
                        <h3 className="r-metrics-card__title">{item.title}</h3>
                        <p className="r-metrics-card__description">{item.description}</p>
                        {item.linkText && (
                            <a className="r-metrics-card__linkText" href={item.linkPath}>{item.linkText}</a>
                        )}
                    </div>
                    <div>{getChart(item)}</div>
                </div>
            )
        default:
            return null
    }
}

export function MetricsCard({ item, className = '', children, shouldEdit = false, onRemove}: MetricsCardProps) {
    const classes = clsx(`r-metrics-card`, className)
    return (
        <Tile className={classes}>
            <div className='r-metrics-card__container'>
                { children ?? (item && getLayout(item)) }

                { shouldEdit && (
                    <button
                        onClick={onRemove}
                        className="r-metrics-card__remove-button"
                        aria-label="Remove Metric"
                    >
                        <CrossIcon className="w-6 h-6" />
                    </button>
                )}

            </div>
        </Tile>
    );
}
