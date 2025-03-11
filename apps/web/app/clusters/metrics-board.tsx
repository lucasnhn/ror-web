'use client'

import { CrossIcon, PencilIcon } from '@/components/icons'
import { Button, MetricsWheel, Tile, MetricsCard } from '@ror/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

// TODO: Implement more types of dashboard items
// TODO: Implement that user can't add the same metric twice
// TODO: Convert MetricsCard to styleguide component
// TODO: Simplify component

interface MetricsBoardProps {
  className?: string
}

type MetricType = '' | 'wheel'

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

const metricTypes: Omit<DashboardItem, 'id'>[] = [
  {
    typeId: 1,
    title: 'Data centers',
    description: 'Data centers with data',
    linkText: "See all",
    linkPath: '#',
    type: 'wheel',
    wheelPart: 5,
    wheelWhole: 6,
    wheelLabel: '5 of 6',
  },
  {
    typeId: 2,
    title: 'Workspaces',
    description: 'Workspaces with data',
    linkText: "See all",
    linkPath: '#',
    type: 'wheel',
    wheelPart: 142,
    wheelWhole: 172,
    wheelLabel: '142 of 172',
    wheelIndicator: true,
  },
  {
    typeId: 3,
    title: 'Clusters',
    description: 'Active clusters',
    type: 'wheel',
    wheelPart: 255,
    wheelWhole: 255,
    wheelLabel: '255 of 255',
    wheelIndicator: true,
  },
  {
    typeId: 4,
    title: 'Nodes',
    description: 'Active nodes',
    type: 'wheel',
    wheelPart: 838,
    wheelWhole: 838,
    wheelLabel: '838 of 838',
    wheelIndicator: true,
  },
  {
    typeId: 5,
    title: 'CPU',
    description: 'Utilized CPU power',
    type: 'wheel',
    wheelPercentage: 13,
    wheelLabel: '13% - 2948',
    wheelIndicator: true,
    inverted: true,
  },
  {
    typeId: 6,
    title: 'Memory',
    description: 'Utilized memory',
    type: 'wheel',
    wheelPercentage: 37,
    wheelLabel: '37% - 13.96 TiB',
    wheelIndicator: true,
    inverted: true,
  },
]

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
          className='block mx-auto'
          inverted={item.inverted}
        />
      )
    default:
      return null
  }
}

export const MetricsBoard = ({ className }: MetricsBoardProps) => {
  const [shouldEdit, setShouldEdit] = useState<boolean>(false)
  const [metrics, setMetrics] = useState<DashboardItem[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dashboardIds')
      try {
        if (!stored) {
          setMetrics(metricTypes.map((metric) => ({ ...metric, id: crypto.randomUUID() })))
          return
        }

        const parsed = JSON.parse(stored)
        if (!Array.isArray(parsed)) {
          setMetrics(metricTypes.map((metric) => ({ ...metric, id: crypto.randomUUID() })))
          return
        }

        const loadedMetrics = parsed
          .map(({ metricId, typeId }: { metricId: string; typeId: number }) => {
            const matchedMetric = metricTypes.find((type) => type.typeId === typeId)
            return matchedMetric ? { id: metricId, ...matchedMetric } : null
          })
          .filter(Boolean) as DashboardItem[]

        setMetrics(loadedMetrics)
      } catch (error) {
        console.error('Error parsing stored metrics:', error)
        setMetrics(metricTypes.map((metric) => ({ ...metric, id: crypto.randomUUID() })))
      }
    }
  }, [])

  const { control, handleSubmit } = useForm<{ metric: string }>({
    defaultValues: { metric: metricTypes[0]?.title || '' },
  })

  const removeMetric = (id: string) => setMetrics((prevMetrics) => prevMetrics.filter((metric) => metric.id !== id))

  const addMetric = (data: { metric: string }) => {
    const newMetric = metricTypes.find((metric) => metric.title === data.metric)
    if (newMetric) {
      setMetrics((prevMetrics) => [...prevMetrics, { ...newMetric, id: crypto.randomUUID() }])
    }
  }

  const saveIds = () => {
    const dashboardIds = metrics.map(({ id, typeId }) => ({ metricId: id, typeId }))
    localStorage.setItem('dashboardIds', JSON.stringify(dashboardIds))
    setShouldEdit(false)
  }

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <div className='flex flex-row justify-between items-center'>
        <h1>Dashboard</h1>
        {shouldEdit ? (
          <div className='flex gap-3'>
            <Button variant='primary' onClick={() => saveIds()}>
              Save
            </Button>
            <Button variant='secondary' onClick={() => setShouldEdit(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button className='flex gap-2' onClick={() => setShouldEdit(true)}>
            <PencilIcon className='h-5 w-5' /> Edit
          </Button>
        )}
      </div>

      <hr className='border-slate-500' />

      <div className={`flex flex-wrap justify-start gap-4`}>
        {metrics.map((item: DashboardItem, i) => (
          <MetricsCard key={i} item={item} shouldEdit={shouldEdit} onRemove={() => removeMetric(item.id)} />
        ))}
        {shouldEdit && (
          <MetricsCard className='flex-col gap-6 border border-transparent hover:border-neutral-200 transition-colors duration-150'>
            <>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-1'>
                  <h3>Add new metric</h3>
                </div>
                <p>What metric do you want to add?</p>
              </div>

              <form className='flex flex-row gap-2 items-center' onSubmit={handleSubmit(addMetric)}>
                <Controller
                  name='metric'
                  control={control}
                  render={({ field }) => (
                    <select {...field} className='w-fit rounded-md bg-neutral-800 border border-neutral-200 py-2 px-4'>
                      {metricTypes.map((type) => (
                        <option key={type.typeId} value={type.title}>
                          {type.title}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <Button type='submit'>
                  Add
                </Button>
              </form>
            </>
          </MetricsCard>
        )}
      </div>
    </div>
  )
}
