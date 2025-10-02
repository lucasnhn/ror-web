/*
 * FILE OVERVIEW:
 * - Component for creating and editing node pools in a Kubernetes cluster.
 * - Utilizes a custom hook for form state management and validation.
 * - Includes sections for name, provider, version, machine class, scaling, labels, and taints.
 * - Displays a summary of the node pool configuration.
 */

'use client'

import React from 'react'
import { Input } from '@/components/shadcn/input'
import { routes } from '@/config/routes'
import { cn } from '@/utils/clsxm'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Button } from '@/components/shadcn/button'
import { MoveLeft, RotateCw, Trash, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'
import type { KubernetesClusterNodePoolStatusType } from '@ror/js-api-client'
import { useNodePoolForm } from '../hooks/use-node-pool-form'
import { generateRandomName } from '../utils/generate-random-name'
import { NumPicker } from '@/components/ui/num-picker'
import { EffectType, effectValues } from '../types/node-pool-form'

type FormApi = ReturnType<typeof useNodePoolForm>

interface CreateEditViewProps {
  className?: string
  id: string
  title: string
  buttonText: string
  nodePool?: KubernetesClusterNodePoolStatusType
  simplePrices?: Array<{ id: string; machineClass: string; price: number }>
}

function NameSection({ form }: { form: FormApi }) {
  return (
    <section>
      <h3>Name</h3>
      <div className='flex flex-row gap-4 items-center'>
        <Input
          type='text'
          value={form.name}
          placeholder='Enter name...'
          onChange={(e) => form.setName(e.target.value)}
        />
        <Button type='button' onClick={() => form.setName(generateRandomName())}>
          <RotateCw />
          Random name
        </Button>
      </div>
      {form.errors.name && <p className='text-red-500 text-sm'>Please enter a name.</p>}
    </section>
  )
}

function ProviderSection({ nodePool, form }: { nodePool?: KubernetesClusterNodePoolStatusType; form: FormApi }) {
  if (nodePool) return null
  return (
    <section>
      <h3>Provider</h3>
      <Input
        type='text'
        value={form.provider}
        placeholder='Enter provider...'
        onChange={(e) => form.setProvider(e.target.value)}
      />
      {form.errors.provider && <p className='text-red-500 text-sm'>Please enter a provider.</p>}
    </section>
  )
}

function VersionSection({ nodePool, form }: { nodePool?: KubernetesClusterNodePoolStatusType; form: FormApi }) {
  if (nodePool) return null
  return (
    <section>
      <h3>Version</h3>
      <Input
        type='text'
        value={form.version}
        placeholder='Enter version...'
        onChange={(e) => form.setVersion(e.target.value)}
      />
      {form.errors.version && <p className='text-red-500 text-sm'>Please enter a version.</p>}
    </section>
  )
}

function MachineClassSection({
  simplePrices,
  form,
}: {
  simplePrices?: Array<{ id: string; machineClass: string; price: number }>
  form: FormApi
}) {
  return (
    <section>
      <h3>Machine class</h3>
      <div className='flex flex-row gap-4 items-center'>
        <Select value={form.selectedPriceId} onValueChange={form.setSelectedPriceId}>
          <SelectTrigger className='w-80'>
            <SelectValue placeholder='Select machine class' />
          </SelectTrigger>
          <SelectContent className='w-80'>
            {(simplePrices ?? []).map(({ id, machineClass, price }) => (
              <SelectItem key={id} value={id}>
                {machineClass} - {price}kr
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {form.errors.class && <p className='text-red-500 text-sm'>Please select a machine class.</p>}
    </section>
  )
}

function ScalingSection({ form }: { form: FormApi }) {
  return (
    <section>
      <h3>Scaling</h3>
      <NumPicker name='replicas' title='Node count' value={form.nodeCount} setValue={form.setNodeCount} />
    </section>
  )
}

function NodeLabelsSection({ form }: { form: FormApi }) {
  return (
    <section>
      <h3>Node labels</h3>
      <div className='grid [grid-template-columns:15rem_15rem_auto] gap-y-4 items-center'>
        <b>Key</b>
        <b>Value</b>
        <b>Actions</b>
        {Object.entries(form.labels).map(([key, value]) => (
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
                form.setLabels((prev) => {
                  const next = { ...prev }
                  delete next[key]
                  return next
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
          value={form.newLabelKey}
          onChange={(e) => form.setNewLabelKey(e.target.value)}
        />
        <Input
          type='text'
          placeholder='Enter value...'
          value={form.newLabelValue}
          onChange={(e) => form.setNewLabelValue(e.target.value)}
        />
        <Button
          type='button'
          className='max-w-fit'
          onClick={() => {
            if (!form.newLabelKey || !form.newLabelValue) return
            form.setLabels((prev) => ({ ...prev, [form.newLabelKey]: form.newLabelValue }))
            form.setNewLabelKey('')
            form.setNewLabelValue('')
          }}
        >
          <PlusIcon /> Add
        </Button>
      </div>
    </section>
  )
}

function NodeTaintsSection({ form, onAdd }: { form: FormApi; onAdd: () => void }) {
  return (
    <section>
      <h3>Node taints</h3>
      <div className='grid [grid-template-columns:15rem_15rem_15rem_auto] gap-y-4 items-center'>
        <b>Key</b>
        <b>Value</b>
        <b>Effect</b>
        <b>Actions</b>
        {Object.entries(form.taints).map(([key, { value, effect }]) => (
          <Fragment key={key}>
            <span className='font-medium flex'>{key}</span>
            <span className='font-medium flex'>{value}</span>
            <span className='font-medium flex'>{effect}</span>
            <Button
              type='button'
              variant='destructive'
              className='max-w-fit'
              onClick={() =>
                form.setTaints((prev) => {
                  const next = { ...prev }
                  delete next[key]
                  return next
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
          value={form.newTaintKey}
          onChange={(e) => form.setNewTaintKey(e.target.value)}
        />
        <Input
          type='text'
          placeholder='Enter value...'
          value={form.newTaintValue}
          onChange={(e) => form.setNewTaintValue(e.target.value)}
        />
        <Select
          value={form.selectedEffect}
          onValueChange={(v) => form.setSelectedEffect(v as typeof form.selectedEffect)}
        >
          <SelectTrigger className='w-52'>
            <SelectValue placeholder='Select effect' />
          </SelectTrigger>
          <SelectContent className='w-52'>
            <SelectItem value='NoSchedule'>NoSchedule</SelectItem>
            <SelectItem value='PreferNoSchedule'>PreferNoSchedule</SelectItem>
            <SelectItem value='NoExecute'>NoExecute</SelectItem>
          </SelectContent>
        </Select>
        <Button type='button' className='max-w-fit' onClick={onAdd}>
          <PlusIcon /> Add
        </Button>
      </div>
    </section>
  )
}

/**
 * Renders a view for creating or editing a node pool within a cluster.
 *
 * @param className - Optional CSS class for the root element.
 * @param id - The cluster ID to which the node pool belongs.
 * @param title - The title to display at the top of the view.
 * @param buttonText - The text to display on the form's submit button.
 * @param nodePool - The existing node pool data, if editing; otherwise undefined for creation.
 * @param simplePrices - Pricing information used for calculating and displaying price estimates.
 *
 * @returns A React component rendering the create/edit node pool view.
 */
export const CreateEditView = ({ className, id, title, buttonText, nodePool, simplePrices }: CreateEditViewProps) => {
  const form = useNodePoolForm(nodePool, simplePrices)

  const handleAddTaint = () => {
    if (!form.newTaintKey || !form.newTaintValue || !effectValues.includes(form.selectedEffect as EffectType)) {
      return
    }

    form.setTaints((prev) => ({
      ...prev,
      [form.newTaintKey]: {
        value: form.newTaintValue,
        effect: form.selectedEffect as EffectType,
      },
    }))

    form.setNewTaintKey('')
    form.setNewTaintValue('')
    form.setSelectedEffect('')
  }

  return (
    <div className={cn(className)}>
      <Link href={routes.app.clusterNodePools.getHref(id)} className='flex flex-row gap-2 hover:underline mb-2'>
        <MoveLeft /> Node pools
      </Link>

      <h2>{title}</h2>

      <div className='flex flex-row gap-32'>
        <form onSubmit={(e) => form.handleSubmit(e, id, nodePool)}>
          <NameSection form={form} />
          <ProviderSection nodePool={nodePool} form={form} />
          <VersionSection nodePool={nodePool} form={form} />
          <MachineClassSection simplePrices={simplePrices} form={form} />
          <ScalingSection form={form} />
          <NodeLabelsSection form={form} />
          <NodeTaintsSection form={form} onAdd={handleAddTaint} />

          <div className='mt-6'>
            <Button type='submit'>{buttonText}</Button>
          </div>
        </form>

        <div className='min-w-md border p-4 h-fit rounded-lg'>
          <h3>Summary</h3>
          <div className='grid grid-cols-2 gap-2'>
            <p className='font-medium'>Name:</p>
            <p>{form.name || ''}</p>
            {!nodePool && <p className='font-medium'>Provider:</p>}
            {!nodePool && <p>{form.provider || ''}</p>}
            {!nodePool && <p className='font-medium'>Version:</p>}
            {!nodePool && <p>{form.version || ''}</p>}
            <p className='font-medium'>Machine class:</p>
            <p>{form.selectedClass || ''}</p>
            <>
              <p className='font-medium'>Node count:</p>
              <p>{form.nodeCount}</p>
            </>
            <p className='font-medium'>Price per node:</p>
            <p>{form.selectedUnitPrice ? `${form.selectedUnitPrice} kr` : 'N/A'}</p>
            <p className='font-medium'>Estimated price per month:</p>
            <p>{form.selectedPrice ? `${form.selectedPrice} kr` : 'N/A'}</p>
            <p className='font-medium'>Estimated price per year:</p>
            <p>{form.selectedPrice ? `${form.selectedPrice * 12} kr` : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
