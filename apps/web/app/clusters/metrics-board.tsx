'use client'

import { PencilIcon } from 'lucide-react'
import { Button, Layer, MetricsCard } from '@ror/react'
import type { MetricsCardItem } from '@ror/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { LayerLevel } from '../../../../packages/react/dist/utils/layer'

// TODO: Implement more types of dashboard items
// TODO: Implement that user can't add the same metric twice

// TODO: Consider implementing these types of dashboard items
/** 
 * SWAGGER LINK: https://api.ror.nhn.no/swagger/index.html#/
 * 
 * ----------
 * 
 * get /v1/cluster/{clusterId}
 * Get a cluster by ID
 * 
 * OTHER THINGS WITH CLUSTERS
 * 
 * ----------
 * 
 * get /v1/datacenters 
 * Get datacenters
 * 
 * get /v1/datacenter/id/{id}
 * Get datacenter by ID
 * 
 * ----------
 * 
 * Everything we already have with metrics
 * 
 * ----------
 * 
 * Consider something with Compliance reports?
 * 
 * ----------
 * 
 * Consider something with Vulnerability reports?
 * 
 * ----------
 * 
 * Consider something with Policy reports?
 * 
 * ----------
 * 
 * Consider something with Desired versions?
 * 
 * ----------
 * 
 * Consider something with Server sent events?
 * 
 * ----------
 * 
 * get /v1/prices
 * Get prices
 * 
 * get /v1/prices/provider/{providerName}
 * Get prices by provider
 * 
 * ----------
 * 
 * get /v1/projects/filter
 * Get projects by filter
 * 
 * get /v1/projects/{projectId}
 * Get projects by ID
 * 
 * get /v1/projects/{projectId}/clusters
 * Get clusters by projectID
 * 
 * ----------
 * 
 * get /v1/providers
 * Get providers
 * 
 * ----------
 * 
 * A lot with resources
 * 
 * ----------
 * 
 * get /v1/users/self
 * Get user
 * 
 * get /v2/self
 * Get self
 * 
 * ----------
 * 
 * get /v1/workspaces
 * Get workspaces
 * 
 * get /v1/workspaces/id/{workspaceName}
 * Get a workspace by id
 * 
 * get /v1/workspaces/{workspaceName}
 * Get a workspace
 * 
 * ----------
 */

interface MetricsBoardProps {
  className?: string
}

const metricTypes: Omit<MetricsCardItem, 'id'>[] = [
  {
    typeId: 1,
    title: 'Data centers',
    description: 'Data centers you have access to',
    linkText: 'See all',
    linkPath: '#',
    type: 'wheel',
    wheelPart: 5,
    wheelWhole: 6,
    wheelLabel: '5 of 6',
  },
  {
    typeId: 2,
    title: 'Workspaces',
    description: 'Workspaces you have access to',
    linkText: 'See all',
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
    description: 'Clusters you have access to',
    type: 'wheel',
    wheelPart: 255,
    wheelWhole: 255,
    wheelLabel: '255 of 255',
    wheelIndicator: true,
  },
  {
    typeId: 4,
    title: 'Nodes',
    description: 'Nodes you have access to',
    type: 'wheel',
    wheelPart: 838,
    wheelWhole: 838,
    wheelLabel: '838 of 838',
    wheelIndicator: true,
  },
  {
    typeId: 5,
    title: 'CPU',
    description: 'Average utilized CPU power',
    type: 'wheel',
    wheelPercentage: 13,
    wheelLabel: '13% - 2948',
    wheelIndicator: true,
    inverted: true,
  },
  {
    typeId: 6,
    title: 'Memory',
    description: 'Average utilized memory',
    type: 'wheel',
    wheelPercentage: 37,
    wheelLabel: '37% - 13.96 TiB',
    wheelIndicator: true,
    inverted: true,
  },
]

export const MetricsBoard = ({ className }: MetricsBoardProps) => {
  const [shouldEdit, setShouldEdit] = useState<boolean>(false)
  const [metrics, setMetrics] = useState<MetricsCardItem[]>([])

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
          .filter(Boolean) as MetricsCardItem[]

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

      <div className={`flex flex-wrap justify-center gap-4`}>
        {metrics.map((item: MetricsCardItem, i) => (
          <MetricsCard key={i} item={item} shouldEdit={shouldEdit} onRemove={() => removeMetric(item.id)} />
        ))}
        {shouldEdit && (
          <MetricsCard>
            <div className='flex flex-col gap-8'>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-1'>
                  <h3>Add new metric</h3>
                </div>
                <p>What metric do you want to add?</p>
              </div>

              <form className='flex flex-row gap-3 items-center' onSubmit={handleSubmit(addMetric)}>
                <Layer layer={1 as LayerLevel}>
                  <Controller
                    name='metric'
                    control={control}
                    render={({ field }) => (
                      <select {...field} className='w-fit rounded-md py-2 px-4 h-9'>
                        {metricTypes.map((type) => (
                          <option key={type.typeId} value={type.title}>
                            {type.title}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </Layer>
                <Button type='submit' className='h-9'>Add</Button>
              </form>
            </div>
          </MetricsCard>

        )}
      </div>
    </div>
  )
}
