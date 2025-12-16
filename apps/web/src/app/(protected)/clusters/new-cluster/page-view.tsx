'use client'

import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/shadcn/select'
import { routes } from '@/config/routes'
import { cn } from '@/utils/clsxm'
import { CodeSnippet } from '@ror/react'
import { MoveLeft, PlusIcon, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { Fragment, useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ChooseButtonProps, CreateClusterForm } from '@/features/cluster/types/create-cluster'
import {
  convertToVitiMachineClass,
  hasAnyValid,
  isTemp,
  priceForCluster,
  renderTagsYaml,
  table2DisplayCondition,
  tableClusterPriceDescription,
} from '@/features/cluster/config/create-cluster-helpers'
import {
  errorTextStyling,
  flexGap4,
  outerTableStyling,
  table1CellStyling,
  tableBlue,
  tableBoldText,
  tableStyling,
} from '@/features/cluster/config/create-cluster-styling'
import { FormSection } from '@/features/cluster/components/create-cluster/inputs/form-section'
import {
  environments,
  networks,
  options,
  optionsAzure,
  optionsTalos,
  optionsTanzu,
  pools,
  providers,
  regions,
} from '@/features/cluster/config/create-cluster-values'

interface PageViewProps {
  className?: string
}

export const PageView = ({ className }: PageViewProps) => {
  // Form
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

  const providerWatch = watch('provider')
  const regionWatch = watch('region')
  const tempProviderWatch = watch('tempProvider')
  const tempRegionWatch = watch('tempRegion')
  const wpClassWatch = watch('wpClass')
  const wpNumberWatch = watch('wpNumber')
  const cpWatch = watch('cp')
  const tagsWatch = watch('tags')
  const nameWatch = watch('name')
  const networkWatch = watch('network')
  const environmentWatch = watch('environment')
  const projectWatch = watch('project')
  const wpNameWatch = watch('wpName')

  // Helper functions for form
  const onSubmit = async () => {
    copyYaml()
    router.push(`${routes.app.clusters.getHref()}?creating-cluster=true`)
  }

  const addTag = () => {
    if (!tagKey.trim() || !tagValue.trim()) return

    setValue('tags', {
      ...tagsWatch,
      [tagKey]: tagValue,
    })

    setTagKey('')
    setTagValue('')
  }

  const removeTag = (key: string) => {
    const copy = { ...tagsWatch }
    delete copy[key]
    setValue('tags', copy)
  }

  // Routing
  const router = useRouter()

  // YAML
  const copyYaml = async () => {
    try {
      await navigator.clipboard.writeText(generateYaml())
      toast.info('YAML copied to clipboard')
    } catch {
      toast.error('Failed to copy YAML')
    }
  }

  const generateYaml = () => `
apiVersion: vitistack.io/v1alpha1
kind: KubernetesCluster
metadata:
  name: ${nameWatch || ''}-4y8e
  annotations:
    vitistack.io/networknamespace: ${networkWatch || ''}
${renderTagsYaml(tagsWatch)}
spec:
  data:
    clusterUid: 5d6da5d8-9a10-4a65-8db9-6aa1027d4b4d
    clusterId: ${nameWatch || ''}-4y8e
    provider: ${providerWatch || ''}
    environment: ${environmentWatch || ''}
    datacenter: ${regionWatch || ''}
    project: ${projectWatch || ''}
    region: ${regionWatch || ''}
    workorder: "simple-workorder" 
    zone: "az1" 
    workspace: ${networkWatch || ''} 
  topology:
    version: "1.34.1"
    controlplane:
      replicas: ${cpWatch || 1}
      version: "1.34.1"
      machineClass: small
      provider: kubevirt 
      storage: 
        - class: "standard"
          path: "/var/lib/vitistack/kubevirt"
          size: "20Gi"
      metadata:
        annotations:
          environment: ${environmentWatch || ''}
          region: ${regionWatch || ''}
        labels:
          environment: ${environmentWatch || ''}
          region: ${regionWatch || ''}
    workers:
      nodePools:
        - name: ${wpNameWatch || ''}
          taint: []
          version: "1.34.1"
          replicas: ${wpNumberWatch || '1'}
          machineClass: ${convertToVitiMachineClass(wpClassWatch) || 'medium'}
          autoscaling:
            enabled: false
            minReplicas: 1
            maxReplicas: 5
            scalingRules:
              - "cpu"
          metadata:
            annotations:
              environment: ${environmentWatch || ''}
              region: ${regionWatch || ''}
            labels:
              environment: ${environmentWatch || ''}
              region: ${regionWatch || ''}
          provider: kubevirt
          storage:
            - class: "standard"
              path: "/var/lib/vitistack/kubevirt"
              size: "20Gi"
    `
  // States
  const [tagKey, setTagKey] = useState('')
  const [tagValue, setTagValue] = useState('')
  const [yamlOpen, setYamlOpen] = useState(false)
  const [changeRPP, setChangeRPP] = useState(false)

  // Form components
  const ChooseButton = ({ provider, region }: ChooseButtonProps) => {
    return (
      <>
        {providerWatch === provider && regionWatch === region ? (
          <span className='px-3 py-2 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>Chosen</span>
        ) : (
          <Button
            type='button'
            onClick={() => {
              setValue('region', region)
              setValue('provider', provider)
            }}
          >
            Choose
          </Button>
        )}
      </>
    )
  }

  const ProjectInput = useCallback(() => {
    return (
      <FormSection title='Project' error={errors.project && errors.project.message}>
        <Input {...register('project', { required: 'Name is required' })} placeholder='Enter project...' />
      </FormSection>
    )
  }, [errors.project])

  const TempProviderDropdown = () => {
    return (
      <Controller
        name='tempProvider'
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className='w-52'>{field.value || 'Select provider'}</SelectTrigger>
            <SelectContent>
              {providers.map((provider) => (
                <SelectItem key={provider.key} value={provider.key}>
                  {provider.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    )
  }

  const TempRegionDropdown = () => {
    return (
      <Controller
        name='tempRegion'
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className='w-52'>{field.value || 'Select region'}</SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.key} value={region.key}>
                  {region.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    )
  }

  const TagsSection = ({ isInvisible }: { isInvisible: boolean }) => {
    return (
      <section className={isInvisible ? 'invisible' : ''}>
        <h3>Tags</h3>
        <div className='grid grid-cols-[15rem_15rem_auto] gap-y-4 items-center'>
          <b>Key</b>
          <b>Value</b>
          <b></b>
          {Object.entries(tagsWatch).map(([key, value]) => (
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
          <Button className='w-20' onClick={addTag} disabled={!tagKey.trim() || !tagValue.trim()}>
            <PlusIcon /> Add
          </Button>
        </div>
      </section>
    )
  }

  const RegionProviderPrice = () => {
    return (
      <div className={flexGap4}>
        <section>
          <h3>Region, Provider & Price</h3>
          <div className='mb-2 mt-4 flex gap-2'>
            <TempProviderDropdown />
            <TempRegionDropdown />
          </div>

          <table className={outerTableStyling}>
            <tbody>
              <tr>
                <th className={tableStyling}></th>
                {regions.map((region, index) => (
                  <th key={index} className={cn(tableStyling, 'p-2', isTemp(region.key, tempRegionWatch) && tableBlue)}>
                    {region.display}
                  </th>
                ))}
              </tr>

              <tr>
                <th className={cn(tableStyling, isTemp('talos', tempProviderWatch) && tableBlue)}>Talos</th>
                {optionsTalos.map((option, index) => (
                  <td
                    key={index}
                    className={table1CellStyling(option.provider, option.region, tempRegionWatch, tempProviderWatch)}
                  >
                    {option.valid && <X className='mx-auto my-2' />}
                  </td>
                ))}
              </tr>

              <tr>
                <th className={cn(tableStyling, 'p-2', isTemp('tanzu', tempProviderWatch) && tableBlue)}>Tanzu</th>
                {optionsTanzu.map((option, index) => (
                  <td
                    key={index}
                    className={table1CellStyling(option.provider, option.region, tempRegionWatch, tempProviderWatch)}
                  >
                    {option.valid && <X className='mx-auto my-2' />}
                  </td>
                ))}
              </tr>

              <tr>
                <th className={cn(tableStyling, 'p-2', isTemp('azure', tempProviderWatch) && tableBlue)}>Azure</th>
                {optionsAzure.map((option, index) => (
                  <td
                    key={index}
                    className={table1CellStyling(option.provider, option.region, tempRegionWatch, tempProviderWatch)}
                  >
                    {option.valid && <X className='mx-auto my-2' />}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          {!hasAnyValid ? (
            <div className={errorTextStyling}>No valid options for this combination.</div>
          ) : (
            <RegionProviderPriceTable />
          )}
        </section>
      </div>
    )
  }

  const NameInput = useCallback(() => {
    return (
      <FormSection title='Cluster name' error={errors.name && errors.name.message}>
        <Input {...register('name', { required: 'Name is required' })} placeholder='Enter name...' />
      </FormSection>
    )
  }, [errors.name])

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
  }, [errors.environment])

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
  }, [errors.cp])

  const WorkerPools = useCallback(() => {
    return (
      <section>
        <h3>Worker pools</h3>

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
            max: { value: 10, message: 'Cannot have more than workerpools' },
            valueAsNumber: true,
            onChange: (e) => {
              const cleaned = e.target.value.replace(/[^0-9]/g, '')
              e.target.value = cleaned
            },
          })}
          placeholder='Enter workerpools num'
        />
        {errors.cp && <span className={errorTextStyling}>{errors.cp.message}</span>}

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
      </section>
    )
  }, [errors.wpName, errors.cp, errors.wpClass])

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
  }, [errors.network])

  const ClusterYaml = () => {
    return (
      <section>
        <h3>Cluster YAML</h3>
        <Button type='button' className='mr-1' onClick={() => setYamlOpen(!yamlOpen)}>
          {yamlOpen ? 'Close YAML' : 'Open YAML'}
        </Button>
        <Button type='button' className='ml-1' onClick={copyYaml}>
          Copy YAML
        </Button>
        {yamlOpen && (
          <CodeSnippet type='multi' className='rounded-lg mt-2' style={{ '--code-snippet-multi-max-height': '27rem' }}>
            {generateYaml()}
          </CodeSnippet>
        )}
      </section>
    )
  }

  const RPPSection = () => {
    return (
      <>
        <h3>Region, Provider & Price</h3>
        <div>
          <p>The price will automatically adjust based on your amount of control planes and worker pools.</p>
          <button
            type='button'
            className='hover:underline italic text-left'
            onClick={() => setChangeRPP((old) => !old)}
          >
            Need to change the data? Click here.
          </button>
        </div>
        <div>
          <p>Control planes: {cpWatch}</p>
          <p>Worker pools: {wpNumberWatch}</p>
        </div>
        <div className='border border-white rounded-md py-2 px-3 w-52'>
          <table className='w-full border-collapse'>
            <tbody>
              <tr>
                <th className='text-left w-16 py-1'>Region:</th>
                <td className='text-left w-16 py-1'>{regionWatch}</td>
              </tr>
              <tr>
                <th className='text-left w-16 py-1'>Provider:</th>
                <td className='text-left w-16 py-1'>{providerWatch}</td>
              </tr>
              <tr>
                <th className='text-left w-16 py-1'>Price:</th>
                <td className='text-left w-16 py-1'>
                  {priceForCluster(providerWatch, wpClassWatch, wpNumberWatch, cpWatch)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  }

  // Table
  const RegionProviderPriceTable = () => {
    return (
      <table className={outerTableStyling}>
        <tbody>
          {options.map(
            (option, key) =>
              table2DisplayCondition(option.provider, option.region, tempProviderWatch, tempRegionWatch) && (
                <Fragment key={key}>
                  <tr>
                    <td className={tableBoldText}>
                      {option.provider} - {option.region}
                    </td>
                    <td rowSpan={2} className='border border-gray-300 text-right p-2'>
                      {wpClassWatch}
                      <br />
                      {priceForCluster(option.provider, wpClassWatch, wpNumberWatch, cpWatch)}
                    </td>
                    <td rowSpan={2} className='border border-gray-300 text-center p-2'>
                      <ChooseButton provider={option.provider} region={option.region} />
                    </td>
                  </tr>
                  <tr>
                    <td className='p-2'>{tableClusterPriceDescription(cpWatch, wpNumberWatch)}</td>
                  </tr>
                </Fragment>
              )
          )}
        </tbody>
      </table>
    )
  }

  // -----

  return (
    <div className={cn(className, 'px-12 my-8')}>
      <Link href={routes.app.clusters.getHref()} className='flex flex-row gap-2 hover:underline mb-2'>
        <MoveLeft /> Clusters
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className='flex flex-row gap-32'>
          {providerWatch != '' ? (
            <>
              <div className={flexGap4}>
                <ProjectInput />
                <NameInput />
                <EnvironmentInput />
                <ControlPlaneInput />
                <WorkerPools />
                <NetworkInput />
                <TagsSection isInvisible={false} />
              </div>

              {changeRPP ? (
                <div className={flexGap4}>
                  <RegionProviderPrice />
                  {providerWatch && <ClusterYaml />}
                </div>
              ) : (
                <div className={flexGap4}>
                  <RPPSection />
                  {providerWatch && <ClusterYaml />}
                </div>
              )}
            </>
          ) : (
            <>
              <div className={flexGap4}>
                <ProjectInput />
                <NameInput />
                <TagsSection isInvisible={true} />
              </div>

              <RegionProviderPrice />
            </>
          )}
        </div>

        {providerWatch != '' && (
          <Button type='submit' className='mt-4'>
            Create cluster
          </Button>
        )}
      </form>
    </div>
  )
}
