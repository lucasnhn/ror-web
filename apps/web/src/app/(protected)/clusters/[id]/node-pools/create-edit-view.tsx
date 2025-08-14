'use client'

import { cn } from '@/utils/clsxm'
import { Minus, MoveLeft, Plus, PlusIcon, RotateCw, Trash } from 'lucide-react'
import Link from 'next/link'
import { routes } from '@/config/routes'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import words from 'an-array-of-english-words'
import { Fragment, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/shadcn/select'
import { Checkbox } from '@/components/shadcn/checkbox'
import { toast } from 'sonner'
import { createOrUpdateNodePoolAction } from '@/utils/node-pool-actions'
import { KubernetesClusterNodePoolStatusType } from '@ror/js-api-client'

interface CreateEditViewProps {
  className?: string
  id: string
  title: string
  buttonText: string
  nodePool?: KubernetesClusterNodePoolStatusType
}

const generateRandomName = (): string => {
  const shortWords = words.filter((word) => word.length <= 8)
  const randomWord1 = shortWords[Math.floor(Math.random() * shortWords.length)]
  const randomWord2 = shortWords[Math.floor(Math.random() * shortWords.length)]
  return `${randomWord1}-${randomWord2}`
}

const NumPicker = ({
  title,
  value,
  setValue,
  name,
}: {
  title: string
  value: number
  setValue: (v: number) => void
  name: string
}) => {
  const increment = () => setValue(value + 1)
  const decrement = () => setValue(Math.max(1, value - 1))
  return (
    <div>
      <h4>{title}</h4>
      <div className='flex flex-row items-center gap-1'>
        <Button type='button' onClick={decrement}>
          <Minus />
        </Button>
        <span className='w-20 bg-[var(--r-layer)] h-9 flex justify-center items-center border-1 rounded-[7px]'>
          {value}
        </span>
        <Button type='button' onClick={increment}>
          <Plus />
        </Button>
      </div>
      <input type='hidden' name={name} value={String(value)} />
    </div>
  )
}

export const CreateEditView = ({ className, id, title, buttonText, nodePool }: CreateEditViewProps) => {
  const [name, setName] = useState(nodePool?.name || '')
  const [version, setVersion] = useState('NO VERSION IN STATUS')
  const [provider, setProvider] = useState('NO PROVIDER IN STATUS')
  const [autoscaling, setAutoscaling] = useState(!nodePool?.autoscaling || false)
  const [nodeCount, setNodeCount] = useState(nodePool?.scale || 1)
  const [minNodes, setMinNodes] = useState(nodePool?.autoscaling?.minReplicas || 1)
  const [maxNodes, setMaxNodes] = useState(nodePool?.autoscaling?.maxReplicas || 1)
  const [labels, setLabels] = useState<Record<string, string>>({})
  const [newLabelKey, setNewLabelKey] = useState('NO LABEL KEY IN STATUS')
  const [newLabelValue, setNewLabelValue] = useState('NO LABEL VALUE IN STATUS')
  const [taints, setTaints] = useState<Record<string, { value: string; effect: string }>>({})
  const [newTaintKey, setNewTaintKey] = useState('NO TAINT KEY IN STATUS')
  const [newTaintValue, setNewTaintValue] = useState('NO TAINT VALUE IN STATUS')
  const [selectedMachineClass, setSelectedMachineClass] = useState(nodePool?.machineClass || '')
  const [nameError, setNameError] = useState(false)
  const [versionError, setVersionError] = useState(false)
  const [classError, setClassError] = useState(false)
  const [providerError, setProviderError] = useState(false)
  const [selectedEffect, setSelectedEffect] = useState(false)
  return (
    <div className={cn(className)}>
      <Link href={routes.app.clusterNodePools.getHref(id)} className='flex flex-row gap-2 hover:underline mb-2'>
        <MoveLeft />
        Node pools
      </Link>
      <h2>{title}</h2>
      <div className='flex flex-row gap-32'>
        <form
          onSubmit={async (e) => {
            e.preventDefault()

            let hasError = false

            if (!name) {
              setNameError(true)
              hasError = true
            } else {
              setNameError(false)
            }

            if (!selectedMachineClass) {
              setClassError(true)
              hasError = true
            } else {
              setClassError(false)
            }

            if (!provider) {
              setProviderError(true)
              hasError = true
            } else {
              setProviderError(false)
            }

            if (!version) {
              setVersionError(true)
              hasError = true
            } else {
              setVersionError(false)
            }

            if (hasError) {
              return // Prevent submission
            }

            // If valid, construct form data and call your server action
            const formData = new FormData()
            formData.append('id', id)
            formData.append('name', name)
            {
              !nodePool && formData.append('provider', provider)
            }
            {
              !nodePool && formData.append('version', version)
            }
            formData.append('machineClass', selectedMachineClass)
            formData.append('autoscaling', String(autoscaling))
            formData.append('labels', JSON.stringify(labels))
            formData.append('taints', JSON.stringify(taints))
            if (autoscaling) {
              formData.append('minReplicas', String(minNodes))
              formData.append('maxReplicas', String(maxNodes))
            } else {
              formData.append('replicas', String(nodeCount))
            }

            try {
              await createOrUpdateNodePoolAction(formData)
              toast.success(`Node pool "${name}" saved successfully`)
            } catch {
              toast.error('Failed to create node pool')
            }
          }}
        >
          <section>
            <input type='hidden' name='id' value={id} />
            <input type='hidden' name='name' value={name} />
            <input type='hidden' name='version' value={version} />
            <input type='hidden' name='provider' value={provider} />
            <input type='hidden' name='machineClass' value={selectedMachineClass} />
            <input type='hidden' name='autoscaling' value={String(autoscaling)} />
            <input type='hidden' name='labels' value={JSON.stringify(labels)} />
            <input type='hidden' name='taints' value={JSON.stringify(taints)} />

            <h3>Name</h3>
            <div className='flex flex-row gap-4 items-center'>
              <Input type='text' value={name} placeholder='Enter name...' onChange={(e) => setName(e.target.value)} />
              <Button type='button' onClick={() => setName(generateRandomName())}>
                <RotateCw />
                Random name
              </Button>
            </div>
            {nameError && <p className='text-red-500 dark:text-red-600 text-sm'>Please enter a name.</p>}
          </section>

          {!nodePool && (
            <section>
              <h3>Provider</h3>
              <Input
                type='text'
                value={provider}
                placeholder='Enter provider...'
                onChange={(e) => setProvider(e.target.value)}
              />
              {providerError && <p className='text-red-500 dark:text-red-600 text-sm'>Please enter a provider.</p>}
            </section>
          )}

          {!nodePool && (
            <section>
              <h3>Version</h3>
              <Input
                type='text'
                value={version}
                placeholder='Enter version...'
                onChange={(e) => setVersion(e.target.value)}
              />
              {versionError && <p className='text-red-500 dark:text-red-600 text-sm'>Please enter a version.</p>}
            </section>
          )}

          <section>
            <h3>Machine class</h3>
            <div className='flex flex-row gap-4 items-center'>
              {/* TODO: implement actual machine classes */}
              <Select value={selectedMachineClass} onValueChange={setSelectedMachineClass}>
                <SelectTrigger className='w-52'>{selectedMachineClass || 'Select machine class'}</SelectTrigger>
                <SelectContent className='w-52'>
                  <SelectItem value='small'>Small</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='large'>Large</SelectItem>
                  <SelectItem value='xlarge'>X-Large</SelectItem>
                  <SelectItem value='best-effort-cpu-2xlarge'>best-effort-cpu-2xlarge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {classError && <p className='text-red-500 dark:text-red-600 text-sm'>Please select a machine class.</p>}
          </section>

          <section>
            <h3>Scaling</h3>
            <div>
              {autoscaling ? (
                <div className='flex flex-row gap-4'>
                  <NumPicker
                    name='minReplicas'
                    title='Min nodes'
                    value={minNodes}
                    setValue={(v) => v <= maxNodes && setMinNodes(v)}
                  />
                  <NumPicker
                    name='maxReplicas'
                    title='Max nodes'
                    value={maxNodes}
                    setValue={(v) => v >= minNodes && setMaxNodes(v)}
                  />
                </div>
              ) : (
                <NumPicker name='replicas' title='Node count' value={nodeCount} setValue={setNodeCount} />
              )}
              <div className='flex flex-row items-center gap-2 mt-2'>
                <Checkbox
                  checked={autoscaling}
                  onCheckedChange={(checked) => setAutoscaling(!!checked)}
                  id='autoscaling-toggle'
                />
                <label htmlFor='autoscaling-toggle' className='ml-2'>
                  Enable autoscaling
                </label>
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-600'>
                The cluster can be automatically scaled up or down. This can have a significant impact on the pricing of
                your cluster.
              </p>
            </div>
          </section>

          {!nodePool && (
            <section>
              <h3>Node labels</h3>
              <div className='grid [grid-template-columns:15rem_15rem_auto] gap-y-4 items-center'>
                <b>Key</b>
                <b>Value</b>
                <b>Actions</b>
                {Object.entries(labels).map(([key, value]) => (
                  <Fragment key={key}>
                    <div>
                      <span className='font-medium flex'>{key}</span>
                    </div>
                    <div>
                      <span className='font-medium flex'>{value}</span>
                    </div>
                    <Button
                      type='button'
                      variant='destructive'
                      className='max-w-fit'
                      onClick={() =>
                        setLabels((prev) => {
                          const newLabels = { ...prev }
                          delete newLabels[key]
                          return newLabels
                        })
                      }
                    >
                      <Trash />
                    </Button>
                  </Fragment>
                ))}
                <Input
                  type='text'
                  placeholder='Enter key...'
                  value={newLabelKey}
                  onChange={(e) => setNewLabelKey(e.target.value)}
                />
                <Input
                  type='text'
                  placeholder='Enter value...'
                  value={newLabelValue}
                  onChange={(e) => setNewLabelValue(e.target.value)}
                />
                <Button
                  type='button'
                  className='max-w-fit'
                  onClick={() => {
                    if (!newLabelKey || !newLabelValue) return
                    setLabels((prev) => ({ ...prev, [newLabelKey]: newLabelValue }))
                    setNewLabelKey('')
                    setNewLabelValue('')
                  }}
                >
                  <PlusIcon />
                  Add
                </Button>
              </div>
            </section>
          )}

          {!nodePool && (
            <section>
              <h3>Node taints</h3>
              <div className='grid [grid-template-columns:15rem_15rem_15rem_auto] gap-y-4 items-center'>
                <b>Key</b>
                <b>Value</b>
                <b>Effect</b>
                <b>Actions</b>
                {Object.entries(taints).map(([key, { value, effect }]) => (
                  <Fragment key={key}>
                    <span className='font-medium flex'>{key}</span>
                    <span className='font-medium flex'>{value}</span>
                    <span className='font-medium flex'>{effect}</span>
                    <Button
                      type='button'
                      variant='destructive'
                      className='max-w-fit'
                      onClick={() =>
                        setTaints((prev) => {
                          const newTaints = { ...prev }
                          delete newTaints[key]
                          return newTaints
                        })
                      }
                    >
                      <Trash />
                    </Button>
                  </Fragment>
                ))}
                <Input
                  type='text'
                  placeholder='Enter key...'
                  value={newTaintKey}
                  onChange={(e) => setNewTaintKey(e.target.value)}
                />
                <Input
                  type='text'
                  placeholder='Enter value...'
                  value={newTaintValue}
                  onChange={(e) => setNewTaintValue(e.target.value)}
                />
                <Select value={selectedEffect} onValueChange={setSelectedEffect}>
                  <SelectTrigger className='w-52'>{selectedEffect || 'Select effect'}</SelectTrigger>
                  <SelectContent className='w-52'>
                    <SelectItem value='NoSchedule'>NoSchedule</SelectItem>
                    <SelectItem value='PreferNoSchedule'>PreferNoSchedule</SelectItem>
                    <SelectItem value='NoExecute'>NoExecute</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type='button'
                  className='max-w-fit'
                  onClick={() => {
                    if (!newTaintKey || !newTaintValue || !selectedEffect) return
                    setTaints((prev) => ({ ...prev, [newTaintKey]: { value: newTaintValue, effect: selectedEffect } }))
                    setNewTaintKey('')
                    setNewTaintValue('')
                    setSelectedEffect('')
                  }}
                >
                  <PlusIcon />
                  Add
                </Button>
              </div>
            </section>
          )}

          <div className='mt-6'>
            <div className='mt-6'>
              <Button type='submit'>{buttonText}</Button>
            </div>
          </div>
        </form>

        <div className='min-w-md border p-4 h-fit rounded-lg'>
          <h3>Summary</h3>
          <div className='grid grid-cols-2 gap-2'>
            <p className='font-medium'>Name:</p>
            <p>{name || ''}</p>
            {!nodePool && <p className='font-medium'>Provider:</p>}
            {!nodePool && <p>{provider || ''}</p>}
            {!nodePool && <p className='font-medium'>Version:</p>}
            {!nodePool && <p>{version || ''}</p>}
            <p className='font-medium'>Machine class:</p>
            <p>{selectedMachineClass || ''}</p>
            <p className='font-medium'>Autoscaling:</p>
            <p>{autoscaling ? 'Enabled' : 'Disabled'}</p>
            {autoscaling ? (
              <>
                <p className='font-medium'>Min Nodes:</p>
                <p>{minNodes}</p>
                <p className='font-medium'>Max Nodes:</p>
                <p>{maxNodes}</p>
              </>
            ) : (
              <>
                <p className='font-medium'>Node count:</p>
                <p>{nodeCount}</p>
              </>
            )}
            <p className='font-medium'>Price calculation:</p>
            <p>{'Needs to be implemented'}</p>
            <p className='font-medium'>Estimated price per month:</p>
            <p>{'Needs to be implemented'}</p>
            <p className='font-medium'>Estimated price per year:</p>
            <p>{'Needs to be implemented'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
