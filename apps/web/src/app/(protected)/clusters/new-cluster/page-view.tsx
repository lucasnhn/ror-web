'use client'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/shadcn/select'
import { routes } from '@/config/routes'
import { cn } from '@/utils/clsxm'
import { CodeSnippet } from '@ror/react'
import { MoveLeft, PlusIcon, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * Props for the PageView component.
 *
 * @property {string} [className] - Optional CSS class name for custom styling.
 * @property {User} user - The current user object.
 * @property {KubernetesCluster[]} clusters - Array of Kubernetes clusters to display.
 * @property {Params} params - Route or query parameters relevant to the page view.
 */
interface PageViewProps {
  className?: string
}

interface CreateClusterForm {
  name: string
  project: string
  environment: string
  cp: number
  wpName: string
  wpNumber: number
  wpClass: string
  network: string
  tags: Record<string, string>
  tempProvider: 'talos' | 'tanzu' | 'azure' | ''
  tempRegion: 'north' | 'east' | 'west' | 'central' | 'south' | ''
  provider: 'talos' | 'tanzu' | 'azure' | ''
  region: 'north' | 'east' | 'west' | 'central' | 'south' | ''
}

/**
 * Renders the main page view for displaying Kubernetes clusters, including filtering, sorting, searching,
 * infinite loading, and display options (grid or table view).
 *
 * @param className - Optional CSS class name for the root container.
 * @param user - The current user object, used for permissions and display.
 * @param clusters - Initial list of Kubernetes clusters to display.
 * @param params - URL/query parameters controlling filters, sorting, and view mode.
 *
 * Features:
 * - Infinite loading of clusters with pagination.
 * - Filtering by environment, datacenter, and workspace.
 * - Sorting by various cluster properties (name, CPU, memory, nodes, price, etc.).
 * - Search functionality across clusters.
 * - Toggle between grid and table views.
 * - Export clusters as CSV or Excel.
 * - Displays a development notice message.
 *
 * @returns The rendered page view component.
 */
export const PageView = ({ className }: PageViewProps) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateClusterForm>({
    defaultValues: {
      tags: {},
      tempProvider: '',
      tempRegion: '',
      provider: '',
      region: '',
      wpClass: 'best-effort-medium',
      cp: 3,
      wpNumber: 3,
    },
  })

  const form = watch()

  const onSubmit = (data: CreateClusterForm) => {
    console.log(data)
  }

  const addTag = () => {
    if (!tagKey.trim() || !tagValue.trim()) return

    setValue('tags', {
      ...tags,
      [tagKey]: tagValue,
    })

    setTagKey('')
    setTagValue('')
  }

  const removeTag = (key: string) => {
    const copy = { ...tags }
    delete copy[key]
    setValue('tags', copy)
  }

  const prices = [
    {
      id: '62b1ad7161ecad60301b45ab',
      provider: 'tanzu',
      machineClass: 'best-effort-small',
      cpu: 2,
      memory: 4,
      memoryBytes: 4017246208,
      price: 330 * 2,
      from: '2024-12-31T23:00:00Z',
      to: '2025-12-30T23:00:00Z',
    },
    {
      id: '62b1ad7161ecad60301b45ac',
      provider: 'tanzu',
      machineClass: 'best-effort-medium',
      cpu: 2,
      memory: 8,
      memoryBytes: 8238813184,
      price: 491 * 2,
      from: '2024-12-31T23:00:00Z',
      to: '2025-12-30T23:00:00Z',
    },
    {
      id: '62b1ad7161ecad60301b45ad',
      provider: 'tanzu',
      machineClass: 'best-effort-large',
      cpu: 4,
      memory: 16,
      memoryBytes: 16681451520,
      price: 1600 * 2,
      from: '2024-12-31T23:00:00Z',
      to: '2025-12-30T23:00:00Z',
    },
    {
      id: '67a5feca61bd5d8df1934fde',
      provider: 'talos',
      machineClass: 'best-effort-small',
      cpu: 4,
      memory: 14,
      memoryBytes: 0,
      price: 330,
      from: '2024-12-03T14:07:07.469Z',
      to: '2026-12-30T23:00:00Z',
    },
    {
      id: '67a5feca61bd5d8df1934fdf',
      provider: 'talos',
      machineClass: 'best-effort-medium',
      cpu: 4,
      memory: 14,
      memoryBytes: 0,
      price: 491,
      from: '2024-12-03T14:07:07.469Z',
      to: '2026-12-30T23:00:00Z',
    },
    {
      id: '67a5feca61bd5d8df1934fe0',
      provider: 'talos',
      machineClass: 'best-effort-large',
      cpu: 4,
      memory: 14,
      memoryBytes: 0,
      price: 1600,
      from: '2024-12-03T14:07:07.469Z',
      to: '2026-12-30T23:00:00Z',
    },
    {
      id: '67a5feca61bd5d7df1934fde',
      provider: 'azure',
      machineClass: 'best-effort-small',
      cpu: 4,
      memory: 14,
      memoryBytes: 0,
      price: 330 * 3,
      from: '2024-12-03T14:07:07.469Z',
      to: '2026-12-30T23:00:00Z',
    },
    {
      id: '67a5feca61bd5d7df1934fdf',
      provider: 'azure',
      machineClass: 'best-effort-medium',
      cpu: 4,
      memory: 14,
      memoryBytes: 0,
      price: 491 * 3,
      from: '2024-12-03T14:07:07.469Z',
      to: '2026-12-30T23:00:00Z',
    },
    {
      id: '67a5feca61bd5d7df1934fe0',
      provider: 'azure',
      machineClass: 'best-effort-large',
      cpu: 4,
      memory: 14,
      memoryBytes: 0,
      price: 1600 * 3,
      from: '2024-12-03T14:07:07.469Z',
      to: '2026-12-30T23:00:00Z',
    },
  ]

  const renderTagsYaml = (tags: Record<string, string>) => {
    return Object.entries(tags)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join('\n')
  }

  const generateYaml = () => `
apiVersion: vitistack.io/v1alpha1
kind: KubernetesCluster
metadata:
  name: ${form.name || ''}
  annotations:
    vitistack.io/networknamespace: ${form.network}
  ${renderTagsYaml(form.tags)}
spec:
  data:
    clusterUid: 5d6da5d8-9a10-4a65-8db9-6aa1027d4b4d
    clusterId: ${form.name || ''}
    provider: ${form.provider || ''}
    environment: ${form.environment || ''}
    datacenter: ${form.region || ''}
    project: ${form.project || ''}
    region: ${form.region || ''}
    workorder: "simple-workorder" 
    zone: "az1" 
    workspace: ${form.network} 
  # Empty spec will use defaults:
  # - 1 control plane node
  # - 1 worker nodes
  topology:
    version: "1.34.1"
    controlplane:
      # Defaults to 1 replica
      replicas: ${form.cp || 1}
      version: "1.34.1"
      machineClass: small
      provider: proxmox 
      storage: 
        - class: "standard"
          path: "/var/lib/vitistack/kubevirt"
          size: "20Gi"
      metadata:
        annotations:
          environment: ${form.environment || ''}
          region: ${form.region || ''}
        labels:
          environment: ${form.environment || ''}
          region: ${form.region || ''}
    workers:
      nodePools:
        - name: ${form.wpName || ''}
          taint: []
          version: "1.34.1"
          # Defaults to 1 replica
          replicas: ${form.wpNumber || '1'}
          # Defaults to "standard" machine class
          machineClass: ${form.wpClass || ''}
          autoscaling:
            enabled: false
            minReplicas: 1
            maxReplicas: 5
            scalingRules:
              - "cpu"
          metadata:
            annotations:
              environment: ${form.environment || ''}
              region: ${form.region || ''}
            labels:
              environment: ${form.environment || ''}
              region: ${form.region || ''}
          provider: kubevirt
          storage:
            - class: "standard"
              path: "/var/lib/vitistack/kubevirt"
              size: "20Gi"
    `

  const [tagKey, setTagKey] = useState('')
  const [tagValue, setTagValue] = useState('')
  const [yamlOpen, setYamlOpen] = useState(false)

  const tags = watch('tags')

  const getPrice = (provider: string): number | null => {
    const match = prices.find(
      (p) =>
        p.provider.toLowerCase() === provider.toLowerCase() &&
        p.machineClass.toLowerCase() === (form.wpClass || 'best-effort-medium').toLowerCase()
    )

    if (!match || typeof match.price !== 'number') {
      return null
    }

    const wp = form.wpNumber || 3
    const cp = form.cp || 3

    return match.price * wp * cp
  }

  const formatPrice = (price: number) => {
    const splitUp: string[] = []
    let i = price.toString().length

    while (i > 0) {
      const start = Math.max(i - 3, 0)
      const chunk = price.toString().slice(start, i)
      splitUp.unshift(chunk)
      i = start
    }

    let formattedPrice = ''

    for (const piece of splitUp) {
      formattedPrice += piece
      formattedPrice += '.'
    }

    return formattedPrice.slice(0, -1) + ' NOK'
  }

  const priceForCluster = (provider: string): string => {
    const price = getPrice(provider)
    if (price == null) {
      return 'Cannot fetch price'
    }
    return formatPrice(price)
  }

  const optionMap = [
    'talos-west',
    'talos-central',
    'talos-south',
    'tanzu-east',
    'tanzu-central',
    'azure-east',
    'azure-west',
  ]

  const isTempRegion = (r: string) => form.tempRegion === r
  const isTempProvider = (p: string) => form.tempProvider === p
  const isOption = (option: string) => optionMap.includes(option)

  return (
    <div className={cn(className, 'px-12 my-8')}>
      <Link href={routes.app.clusters.getHref()} className='flex flex-row gap-2 hover:underline mb-2'>
        <MoveLeft /> Clusters
      </Link>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-row gap-32'>
          {form.provider != '' && (
            <div className='flex flex-col gap-4'>
              <section>
                <h3>Cluster name</h3>
                <Input {...register('name', { required: 'Name is required' })} placeholder='Enter name...' />
                {errors.name && <span className='text-red-600'>{errors.name.message}</span>}
              </section>

              <section>
                <h3>Environment</h3>
                <Controller
                  name='environment'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='w-52'>{field.value || 'Select environment'}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value='prod'>prod</SelectItem>
                        <SelectItem value='test'>test</SelectItem>
                        <SelectItem value='qa'>qa</SelectItem>
                        <SelectItem value='dev'>dev</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </section>

              <section>
                <h3>Control plane</h3>
                <Input
                  type='number'
                  min={1}
                  max={10}
                  {...register('cp', {
                    required: 'Amount of control planes is required',
                    min: { value: 1, message: 'Need at least one control plane' },
                    max: { value: 10, message: 'Cannot have more than ten control planes' },
                  })}
                  placeholder='Enter control plane num'
                />
                {errors.cp && <span className='text-red-600'>{errors.cp.message}</span>}
              </section>

              <section>
                <h3>Worker pools</h3>

                <h4>Name</h4>
                <Input
                  {...register('wpName', { required: 'Workerpool name is required' })}
                  placeholder='Enter name...'
                />
                {errors.wpName && <span className='text-red-600'>{errors.wpName.message}</span>}

                <h4>Number</h4>
                <Input
                  type='number'
                  min={1}
                  max={10}
                  {...register('wpNumber', {
                    required: 'Amount of workerpools is required',
                    min: { value: 1, message: 'Need at least one workerpool' },
                    max: { value: 10, message: 'Cannot have more than workerpools' },
                  })}
                  placeholder='Enter workerpools num'
                />
                {errors.cp && <span className='text-red-600'>{errors.cp.message}</span>}

                <h4>Class</h4>
                <Controller
                  name='wpClass'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='w-52'>{field.value || 'Select class'}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value='best-effort-small'>best-effort-small</SelectItem>
                        <SelectItem value='best-effort-medium'>best-effort-medium</SelectItem>
                        <SelectItem value='best-effort-large'>best-effort-large</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </section>

              <section>
                <h3>Network</h3>
                <Controller
                  name='network'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='w-52'>{field.value || 'Select network'}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value='t-test01'>t-test01</SelectItem>
                        <SelectItem value='t-test02'>t-test02</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </section>

              <section>
                <h3>Tags</h3>
                <div className='grid [grid-template-columns:15rem_15rem_auto] gap-y-4 items-center'>
                  <b>Key</b>
                  <b>Value</b>
                  <b></b>
                  {Object.entries(tags).map(([key, value]) => (
                    <Fragment key={key}>
                      <span>{key}</span>
                      <span>{value}</span>
                      <Button size='icon' variant='destructive' onClick={() => removeTag(key)}>
                        <Trash />
                      </Button>
                    </Fragment>
                  ))}
                  <Input placeholder='Enter key...' value={tagKey} onChange={(e) => setTagKey(e.target.value)} />
                  <Input placeholder='Enter value...' value={tagValue} onChange={(e) => setTagValue(e.target.value)} />
                  <Button onClick={addTag} disabled={!tagKey.trim() || !tagValue.trim()}>
                    <PlusIcon /> Add
                  </Button>
                </div>
              </section>
            </div>
          )}

          <div className='flex flex-col gap-4'>
            <section>
              <h3>Project</h3>
              <Input {...register('project', { required: 'Name is required' })} placeholder='Enter project...' />
              {errors.project && <span className='text-red-600'>{errors.project.message}</span>}
            </section>

            <section>
              <h3>Region & Provider</h3>
              <div className='mb-2 flex gap-2'>
                <Controller
                  name='tempRegion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='w-52'>{field.value || 'Select region'}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value='north'>north</SelectItem>
                        <SelectItem value='east'>east</SelectItem>
                        <SelectItem value='west'>west</SelectItem>
                        <SelectItem value='central'>central</SelectItem>
                        <SelectItem value='south'>south</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name='tempProvider'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='w-52'>{field.value || 'Select provider'}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value='talos'>talos</SelectItem>
                        <SelectItem value='tanzu'>tanzu</SelectItem>
                        <SelectItem value='azure'>azure</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <table className='border border-gray-400 border-collapse w-full'>
                <tbody>
                  <tr>
                    <th className='border border-gray-300'></th>
                    <th
                      className={cn(
                        'border border-gray-300 p-2 transition-colors',
                        isTempRegion('north') && 'bg-blue-100 dark:bg-blue-800 font-semibold'
                      )}
                    >
                      north
                    </th>
                    <th
                      className={cn(
                        'border border-gray-300 p-2 transition-colors',
                        isTempRegion('east') && 'bg-blue-100 dark:bg-blue-800 font-semibold'
                      )}
                    >
                      east
                    </th>
                    <th
                      className={cn(
                        'border border-gray-300 p-2 transition-colors',
                        isTempRegion('west') && 'bg-blue-100 dark:bg-blue-800 font-semibold'
                      )}
                    >
                      west
                    </th>
                    <th
                      className={cn(
                        'border border-gray-300 p-2 transition-colors',
                        isTempRegion('central') && 'bg-blue-100 dark:bg-blue-800 font-semibold'
                      )}
                    >
                      central
                    </th>
                    <th
                      className={cn(
                        'border border-gray-300 p-2 transition-colors',
                        isTempRegion('south') && 'bg-blue-100 dark:bg-blue-800 font-semibold'
                      )}
                    >
                      south
                    </th>
                  </tr>

                  <tr>
                    <th
                      className={cn(
                        'border border-gray-300 p-2',
                        isTempProvider('talos') && 'bg-blue-100 dark:bg-blue-800 font-semibold'
                      )}
                    >
                      Talos
                    </th>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('north') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('talos') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('north') && isTempProvider('talos') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    ></td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('east') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('talos') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('east') && isTempProvider('talos') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    ></td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('west') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('talos') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('west') && isTempProvider('talos') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    >
                      <X className='mx-auto my-2' />
                    </td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('central') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('talos') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('central') &&
                          isTempProvider('talos') &&
                          'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    >
                      <X className='mx-auto my-2' />
                    </td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('south') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('talos') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('south') && isTempProvider('talos') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    >
                      <X className='mx-auto my-2' />
                    </td>
                  </tr>
                  <tr>
                    <th
                      className={cn(
                        'border border-gray-300 p-2',
                        isTempProvider('tanzu') && 'bg-blue-100 dark:bg-blue-800 font-semibold'
                      )}
                    >
                      Tanzu
                    </th>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('north') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('tanzu') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('north') && isTempProvider('tanzu') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    ></td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('east') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('tanzu') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('east') && isTempProvider('tanzu') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    >
                      <X className='mx-auto my-2' />
                    </td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('west') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('tanzu') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('west') && isTempProvider('tanzu') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    ></td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('central') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('tanzu') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('central') &&
                          isTempProvider('tanzu') &&
                          'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    >
                      <X className='mx-auto my-2' />
                    </td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('south') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('tanzu') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('south') && isTempProvider('tanzu') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    ></td>
                  </tr>
                  <tr>
                    <th
                      className={cn(
                        'border border-gray-300 p-2',
                        isTempProvider('azure') && 'bg-blue-100 dark:bg-blue-800 font-semibold'
                      )}
                    >
                      Azure
                    </th>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('north') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('azure') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('north') && isTempProvider('azure') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    ></td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('east') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('azure') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('east') && isTempProvider('azure') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    >
                      <X className='mx-auto my-2' />
                    </td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('west') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('azure') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('west') && isTempProvider('azure') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    >
                      <X className='mx-auto my-2' />
                    </td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('central') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('azure') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('central') &&
                          isTempProvider('azure') &&
                          'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    ></td>
                    <td
                      className={cn(
                        'border border-gray-300',
                        isTempRegion('south') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempProvider('azure') && 'bg-blue-100 dark:bg-blue-800 font-semibold',
                        isTempRegion('south') && isTempProvider('azure') && 'bg-blue-200 dark:bg-blue-900 font-semibold'
                      )}
                    ></td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h3>Provider & Prices</h3>
              <table className='border border-gray-400 border-collapse w-full'>
                <tbody>
                  {(isTempProvider('talos') || isTempProvider('')) &&
                    (isTempRegion('north') || isTempRegion('')) &&
                    isOption('talos-north') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Talos - north</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('talos')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'talos' && form.region === 'north' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'north')
                                  setValue('provider', 'talos')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('talos') || isTempProvider('')) &&
                    (isTempRegion('east') || isTempRegion('')) &&
                    isOption('talos-east') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Talos - east</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('talos')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'talos' && form.region === 'east' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'east')
                                  setValue('provider', 'talos')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('talos') || isTempProvider('')) &&
                    (isTempRegion('west') || isTempRegion('')) &&
                    isOption('talos-west') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Talos - west</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('talos')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'talos' && form.region === 'west' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'west')
                                  setValue('provider', 'talos')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('talos') || isTempProvider('')) &&
                    (isTempRegion('central') || isTempRegion('')) &&
                    isOption('talos-central') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Talos - central</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('talos')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'talos' && form.region === 'central' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'central')
                                  setValue('provider', 'talos')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('talos') || isTempProvider('')) &&
                    (isTempRegion('south') || isTempRegion('')) &&
                    isOption('talos-south') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Talos - south</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('talos')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'talos' && form.region === 'south' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'south')
                                  setValue('provider', 'talos')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('tanzu') || isTempProvider('')) &&
                    (isTempRegion('north') || isTempRegion('')) &&
                    isOption('tanzu-north') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Tanzu - north</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('tanzu')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'tanzu' && form.region === 'north' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'north')
                                  setValue('provider', 'tanzu')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('tanzu') || isTempProvider('')) &&
                    (isTempRegion('east') || isTempRegion('')) &&
                    isOption('tanzu-east') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Tanzu - east</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('tanzu')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'tanzu' && form.region === 'east' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'east')
                                  setValue('provider', 'tanzu')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('tanzu') || isTempProvider('')) &&
                    (isTempRegion('west') || isTempRegion('')) &&
                    isOption('tanzu-west') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Tanzu - west</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('tanzu')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'tanzu' && form.region === 'west' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'west')
                                  setValue('provider', 'tanzu')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('tanzu') || isTempProvider('')) &&
                    (isTempRegion('central') || isTempRegion('')) &&
                    isOption('tanzu-central') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Tanzu - central</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('tanzu')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'tanzu' && form.region === 'central' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'central')
                                  setValue('provider', 'tanzu')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('tanzu') || isTempProvider('')) &&
                    (isTempRegion('south') || isTempRegion('')) &&
                    isOption('tanzu-south') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Tanzu - south</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('tanzu')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'tanzu' && form.region === 'south' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'south')
                                  setValue('provider', 'tanzu')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('azure') || isTempProvider('')) &&
                    (isTempRegion('north') || isTempRegion('')) &&
                    isOption('azure-north') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Azure - north</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('azure')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'azure' && form.region === 'north' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'north')
                                  setValue('provider', 'azure')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('azure') || isTempProvider('')) &&
                    (isTempRegion('east') || isTempRegion('')) &&
                    isOption('azure-east') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Azure - east</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('azure')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'azure' && form.region === 'east' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'east')
                                  setValue('provider', 'azure')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('azure') || isTempProvider('')) &&
                    (isTempRegion('west') || isTempRegion('')) &&
                    isOption('azure-west') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Azure - west</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('azure')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'azure' && form.region === 'west' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'west')
                                  setValue('provider', 'azure')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('azure') || isTempProvider('')) &&
                    (isTempRegion('central') || isTempRegion('')) &&
                    isOption('azure-central') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Azure - central</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('azure')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'azure' && form.region === 'central' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'central')
                                  setValue('provider', 'azure')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                  {(isTempProvider('azure') || isTempProvider('')) &&
                    (isTempRegion('south') || isTempRegion('')) &&
                    isOption('azure-south') && (
                      <>
                        <tr>
                          <td className='border border-gray-300 p-2 font-semibold'>Azure - south</td>
                          <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                            {form.wpClass}
                            <br />
                            {priceForCluster('azure')}
                          </td>
                          <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                            {form.provider === 'azure' && form.region === 'south' ? (
                              <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                                Chosen
                              </span>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setValue('region', 'south')
                                  setValue('provider', 'azure')
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='p-2'>
                            Cluster (3 cp{form.cp > 1 ? 's' : ''}, 3 worker{form.wpNumber > 1 ? 's' : ''})
                          </td>
                        </tr>
                      </>
                    )}
                </tbody>
              </table>
            </section>

            {form.provider && (
              <section>
                <h3>Cluster YAML</h3>
                <Button type='button' className='mr-1' onClick={() => setYamlOpen(!yamlOpen)}>
                  {yamlOpen ? 'Close YAML' : 'Open YAML'}
                </Button>
                <Button
                  type='button'
                  className='ml-1'
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(generateYaml())
                      toast.info('YAML copied to clipboard')
                    } catch {
                      toast.error('Failed to copy YAML')
                    }
                  }}
                >
                  Copy YAML
                </Button>
                {yamlOpen && (
                  <CodeSnippet
                    type='multi'
                    className='rounded-lg mt-2'
                    style={{ '--code-snippet-multi-max-height': '27rem' }}
                  >
                    {generateYaml()}
                  </CodeSnippet>
                )}
              </section>
            )}
          </div>
        </div>

        {form.provider != '' && (
          <Link href={`${routes.app.clusters.getHref()}?creating-cluster=true`}>
            <Button
              type='submit'
              className='mt-4'
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(generateYaml())
                  toast.info('YAML copied to clipboard')
                } catch {
                  toast.error('Failed to copy YAML')
                }
              }}
            >
              Create cluster
            </Button>
          </Link>
        )}
      </form>
    </div>
  )
}
