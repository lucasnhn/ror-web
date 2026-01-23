'use client'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/shadcn/select'
import { routes } from '@/config/routes'
import { CodeSnippet } from '@ror/react'
import React, { useCallback, useState } from 'react'
import { Controller, Path } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CreateClusterForm } from '@/features/cluster/types/create-cluster'
import { errorTextStyling } from '@/features/cluster/config/create-cluster-styling'
import { FormSection } from '@/features/cluster/components/create-cluster/form-section'
import { environments, networks, pools } from '@/features/cluster/config/create-cluster-values'
import { Wizard } from '@/components/ui/wizard'
import { useCreateClusterForm } from '@/features/cluster/hooks/use-create-cluster-form'
import { buildClusterYaml } from '@/features/cluster/utils/generate-cluster-yaml'
import { addTag, removeTag } from '@/features/cluster/utils/tags'
import { TagsSection } from '@/features/cluster/components/create-cluster/tags-section'
import { copyToClipboard } from '@/utils/copy-to-clipboard'
import { RegionProviderPriceSection } from '@/features/cluster/components/create-cluster/region-provider-price-section'
import { WizardContentType } from '@/types/wizard-content-type'
import { cn } from '@/utils/clsxm'

const stepFields: Array<Array<Path<CreateClusterForm>>> = [
  ['project', 'name', 'environment'],
  ['region', 'provider'],
  ['wpName', 'wpNumber', 'wpClass', 'cp'],
  ['network'],
  [],
  [],
]

export const PageView = () => {
  // States
  const [tagKey, setTagKey] = useState('')
  const [tagValue, setTagValue] = useState('')
  const [yamlOpen, setYamlOpen] = useState(false)

  // Hooks
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    trigger,
    formState: { errors },
  } = useCreateClusterForm()

  // Watches
  const wpClassWatch = watch('wpClass')
  const wpNumberWatch = watch('wpNumber')
  const cpWatch = watch('cp')
  const tagsWatch = watch('tags')
  const nameWatch = watch('name')
  const networkWatch = watch('network')
  const environmentWatch = watch('environment')
  const projectWatch = watch('project')
  const wpNameWatch = watch('wpName')

  // Handlers
  const handleAddTag = () => {
    const k = tagKey.trim()
    const v = tagValue.trim()
    if (!k || !v) return

    const current = Array.isArray(tagsWatch) ? tagsWatch : []
    const next = [...current, { key: k, value: v }] // preserves insertion order

    setValue('tags', next, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    setTagKey('')
    setTagValue('')
  }

  const handleRemoveTag = (key: string) => {
    const current = Array.isArray(tagsWatch) ? tagsWatch : []
    setValue(
      'tags',
      current.filter((t) => t.key !== key),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    )
  }

  // Helper functions for form
  const onSubmit = async () => {
    copyYaml()
    router.push(`${routes.app.clusters.getHref()}?creating-cluster=true`)
  }

  // Routing
  const router = useRouter()

  // YAML
  const copyYaml = async () => {
    try {
      await copyToClipboard(buildClusterYaml(getValues()))
      toast.info('YAML copied to clipboard')
    } catch {
      toast.error('Failed to copy YAML')
    }
  }

  // Inputs
  const ProjectInput = useCallback(() => {
    return (
      <FormSection title='Project' error={errors.project && errors.project.message}>
        <Input {...register('project', { required: 'Project is required' })} placeholder='Enter project...' />
      </FormSection>
    )
  }, [errors.project, register])

  const NameInput = useCallback(() => {
    return (
      <FormSection title='Cluster name' error={errors.name && errors.name.message}>
        <Input {...register('name', { required: 'Name is required' })} placeholder='Enter name...' />
      </FormSection>
    )
  }, [errors.name, register])

  const EnvironmentInput = useCallback(() => {
    return (
      <FormSection title='Environment' error={errors.environment && errors.environment.message}>
        <Controller
          name='environment'
          control={control}
          rules={{ required: 'Environment is required' }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className='w-52'>{field.value || 'Select environment'}</SelectTrigger>
              <SelectContent>
                {environments.map((environment) => (
                  <SelectItem key={environment.key} value={environment.key}>
                    {environment.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormSection>
    )
  }, [control, errors.environment])

  const ControlPlaneInput = useCallback(() => {
    return (
      <FormSection title='Control plane' error={errors.cp && errors.cp.message}>
        <Input
          type='number'
          min={1}
          max={10}
          inputMode='numeric'
          pattern='[0-9]*'
          {...register('cp', {
            required: 'Amount of control planes is required',
            min: { value: 1, message: 'Need at least one control plane' },
            max: { value: 10, message: 'Cannot have more than ten control planes' },
            valueAsNumber: true,
            onChange: (e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '')
              e.target.value = cleaned
            },
          })}
          placeholder='Enter control plane num'
        />
      </FormSection>
    )
  }, [errors.cp, register])

  const WorkerPools = useCallback(() => {
    return (
      <section>
        <h3 className={cn('text-3xl', 'sm:text-3xl', 'md:text-4xl')}>Worker pools</h3>

        <div className='w-fit mx-auto mt-2'>
          <h4>Name</h4>
          <Input {...register('wpName', { required: 'Workerpool name is required' })} placeholder='Enter name...' />
          {errors.wpName && <span className={errorTextStyling}>{errors.wpName.message}</span>}

          <h4>Number</h4>
          <Input
            type='number'
            min={1}
            max={10}
            inputMode='numeric'
            pattern='[0-9]*'
            {...register('wpNumber', {
              required: 'Amount of workerpools is required',
              min: { value: 1, message: 'Need at least one workerpool' },
              max: { value: 10, message: 'Cannot have more than 10 workerpools' },
              valueAsNumber: true,
              onChange: (e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '')
                e.target.value = cleaned
              },
            })}
            placeholder='Enter workerpools num'
          />
          {errors.wpNumber && <span className={errorTextStyling}>{errors.wpNumber.message}</span>}

          <h4>Class</h4>
          <Controller
            name='wpClass'
            control={control}
            rules={{ required: 'Workerpool class is required' }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-52'>{field.value || 'Select class'}</SelectTrigger>
                <SelectContent>
                  {pools.map((pool) => (
                    <SelectItem key={pool.key} value={pool.key}>
                      {pool.display}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.wpClass && <span className={errorTextStyling}>{errors.wpClass.message}</span>}
        </div>
      </section>
    )
  }, [register, errors.wpName, errors.wpNumber, errors.wpClass, control])

  const NetworkInput = useCallback(() => {
    return (
      <FormSection title='Network' error={errors.network && errors.network.message}>
        <Controller
          name='network'
          control={control}
          rules={{ required: 'Network is required' }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className='w-52'>{field.value || 'Select network'}</SelectTrigger>
              <SelectContent>
                {networks.map((network) => (
                  <SelectItem key={network.key} value={network.key}>
                    {network.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormSection>
    )
  }, [control, errors.network])

  const SummaryTableRow = ({ title, content }: { title: string; content: string | number }) => (
    <tr>
      <td className='font-semibold py-1 pr-4'>{title}</td>
      <td>{content}</td>
    </tr>
  )

  const Summary = () => {
    return (
      <div className='w-fit'>
        <h3 className={cn('mx-auto w-fit text-3xl', 'sm:text-3xl', 'md:text-5xl')}>Summary</h3>
        <div className={cn('border rounded-lg p-4 overflow-hidden my-4', 'w-full', 'sm:w-96')}>
          <table className={cn('border-separate border-spacing-0 w-full', 'text-sm', 'sm:text-md')}>
            <tbody>
              <SummaryTableRow title='Project' content={projectWatch} />
              <SummaryTableRow title='Cluster name' content={nameWatch} />
              <SummaryTableRow title='Environment' content={environmentWatch} />
              <SummaryTableRow title='Control plane' content={cpWatch} />
              <SummaryTableRow title='Worker pools name' content={wpNameWatch} />
              <SummaryTableRow title='Worker pools number' content={wpNumberWatch} />
              <SummaryTableRow title='Worker pools class' content={wpClassWatch} />
              <SummaryTableRow title='Network' content={networkWatch} />
              <tr>
                <td className='font-semibold pt-1 pb-3 pr-4 align-top'>Tags</td>
                <td>
                  {Object.entries(tagsWatch).length === 0 ? (
                    <span className='italic opacity-70'>No tags</span>
                  ) : (
                    (Array.isArray(tagsWatch) ? tagsWatch : []).map(({ key, value }) => (
                      <p key={key}>
                        {key}: {value}
                      </p>
                    ))
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const ClusterYaml = () => {
    return (
      <section className='w-fit mx-auto'>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Button type='button' className={cn('text-xs', 'sm:text-sm')} onClick={() => setYamlOpen(!yamlOpen)}>
            {yamlOpen ? 'Close YAML' : 'Open YAML'}
          </Button>
          <Button type='button' className={cn('mx-2', 'text-xs', 'sm:text-sm')} onClick={copyYaml}>
            Copy YAML
          </Button>
          <Button type='submit' className={cn('text-xs', 'sm:text-sm')}>
            Create cluster
          </Button>
          {yamlOpen && (
            <CodeSnippet
              type='multi'
              className='rounded-lg mt-2'
              style={{ '--code-snippet-multi-max-height': '27rem' }}
            >
              {buildClusterYaml(getValues())}
            </CodeSnippet>
          )}
        </form>
      </section>
    )
  }

  // Wizard
  const content: WizardContentType[] = [
    {
      title: 'Basics',
      wizardContent: (
        <div className={cn('flex justify-center', 'flex-col gap-4', 'flex-row lg:gap-20')}>
          <ProjectInput />
          <NameInput />
          <EnvironmentInput />
        </div>
      ),
    },
    {
      title: 'Region & Provider',
      wizardContent: (
        <div className='w-fit mx-auto'>
          <RegionProviderPriceSection control={control} setValue={setValue} />
        </div>
      ),
    },
    {
      title: 'Capacity',
      wizardContent: (
        <div className={cn('flex gap-24 w-fit mx-auto', 'flex-col gap-4', 'sm:flex-row sm:gap-24')}>
          <WorkerPools />
          <ControlPlaneInput />
        </div>
      ),
    },
    {
      title: 'Network',
      wizardContent: (
        <div className='w-fit mx-auto'>
          <NetworkInput />
        </div>
      ),
    },
    {
      title: 'Metadata',
      wizardContent: (
        <div className='w-fit mx-auto'>
          <TagsSection
            tags={Array.isArray(tagsWatch) ? tagsWatch : []}
            tagKey={tagKey}
            tagValue={tagValue}
            setTagKey={setTagKey}
            setTagValue={setTagValue}
            addTag={handleAddTag}
            removeTag={handleRemoveTag}
          />
        </div>
      ),
    },
    {
      title: 'Summary',
      wizardContent: (
        <div className='w-fit mx-auto'>
          <Summary />
          <ClusterYaml />
        </div>
      ),
    },
  ]

  return <Wizard<CreateClusterForm> content={content} trigger={trigger} stepFields={stepFields} summary={<Summary />} />
}
