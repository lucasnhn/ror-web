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

interface CreateEditViewProps {
  className?: string
  id: string
  title: string
  buttonText: string
}

const generateRandomName = (): string => {
  const shortWords = words.filter((word) => word.length <= 8)
  const randomWord1 = shortWords[Math.floor(Math.random() * shortWords.length)]
  const randomWord2 = shortWords[Math.floor(Math.random() * shortWords.length)]
  return `${randomWord1}-${randomWord2}`
}

const NumPicker = ({ title, value, setValue }: { title: string; value: number; setValue: (v: number) => void }) => {
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
    </div>
  )
}

export const CreateEditView = ({ className, id, title, buttonText }: CreateEditViewProps) => {
  const [name, setName] = useState('')
  const [autoscaling, setAutoscaling] = useState(false)
  const [nodeCount, setNodeCount] = useState(1)
  const [minNodes, setMinNodes] = useState(1)
  const [maxNodes, setMaxNodes] = useState(1)
  const [labels, setLabels] = useState<Record<string, string>>({ 'Key 1': 'Value 1', 'Key 2': 'Value 2' })
  const [newLabelKey, setNewLabelKey] = useState('')
  const [newLabelValue, setNewLabelValue] = useState('')
  const [taints, setTaints] = useState<Record<string, { value: string; effect: string }>>({})
  const [newTaintKey, setNewTaintKey] = useState('')
  const [newTaintValue, setNewTaintValue] = useState('')
  const [selectedMachineClass, setSelectedMachineClass] = useState('')
  const [nameError, setNameError] = useState(false)
  const [classError, setClassError] = useState(false)
  const [selectedEffect, setSelectedEffect] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let valid = true
    if (!name) {
      setNameError(true)
      valid = false
    } else {
      setNameError(false)
    }
    if (!selectedMachineClass) {
      setClassError(true)
      valid = false
    } else {
      setClassError(false)
    }
    if (!valid) return
    const payload = {
      name,
      autoscaling,
      nodeCount: autoscaling ? undefined : nodeCount,
      minNodes: autoscaling ? minNodes : undefined,
      maxNodes: autoscaling ? maxNodes : undefined,
      labels,
      taints,
      selectedMachineClass,
    }
    alert(JSON.stringify(payload, null, 2))
  }

  return (
    <div className={cn(className)}>
      <Link href={routes.app.clusterNodePools.getHref(id)} className='flex flex-row gap-2 hover:underline mb-2'>
        <MoveLeft />
        Node pools
      </Link>
      <h2>{title}</h2>
      <div className='flex flex-row gap-32'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <section>
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

          <section>
            <h3>Machine class</h3>
            <div className='flex flex-row gap-4 items-center'>
              {/* TODO: implement actual machine classes */}
              <Select onValueChange={setSelectedMachineClass} value={selectedMachineClass}>
                <SelectTrigger className='w-52'>
                  {selectedMachineClass ? selectedMachineClass : 'Select machine class'}
                </SelectTrigger>
                <SelectContent className='w-52'>
                  <SelectItem value='small'>Small</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='large'>Large</SelectItem>
                  <SelectItem value='xlarge'>X-Large</SelectItem>
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
                    title='Min nodes'
                    value={minNodes}
                    setValue={(v) => {
                      if (v <= maxNodes) setMinNodes(v)
                    }}
                  />
                  <NumPicker
                    title='Max nodes'
                    value={maxNodes}
                    setValue={(v) => {
                      if (v >= minNodes) setMaxNodes(v)
                    }}
                  />
                </div>
              ) : (
                <NumPicker title='Node count' value={nodeCount} setValue={setNodeCount} />
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

          <div className='mt-6'>
            <Button type='submit'>{buttonText}</Button>
          </div>
        </form>

        <div className='min-w-md border p-4 h-fit rounded-lg'>
          <h3>Summary</h3>
          <div className='grid grid-cols-2 gap-2'>
            <p className='font-medium'>Name:</p>
            <p>{name || ''}</p>
            <p className='font-medium'>Machine Class:</p>
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
                <p className='font-medium'>Node Count:</p>
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
