import { Fragment } from 'react'
import { Button } from '@/components/shadcn/button'
import { errorTextStyling, outerTableStyling, tableBoldText } from '@/features/cluster/config/create-cluster-styling'
import {
  priceForCluster,
  table2DisplayCondition,
  tableClusterPriceDescription,
} from '@/features/cluster/config/create-cluster-helpers'
import { Control, Controller, UseFormSetValue, useFormState } from 'react-hook-form'
import { CreateClusterForm, Provider, Region } from '@/features/cluster/types/create-cluster'
import { useRppValues } from '@/features/cluster/hooks/use-rpp-values'
import { options } from '@/features/cluster/config/create-cluster-values'
import { cn } from '@/utils/clsxm'
import { Check } from 'lucide-react'

type Props = {
  control: Control<CreateClusterForm>
  setValue: UseFormSetValue<CreateClusterForm>
}

export function RegionProviderPriceTable({ control, setValue }: Props) {
  const { tempProvider, tempRegion, provider, region, wpClass, wpNumber, cp } = useRppValues(control)
  const { errors } = useFormState({ control })

  const choose = (p: Provider, r: Region) => {
    setValue('provider', p, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    setValue('region', r, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
  }

  return (
    <div className={cn('w-full', 'sm:w-2xl')}>
      <p>Price is calculated for 3 control planes and 3 workers</p>
      <table className={outerTableStyling}>
        <thead>
          <tr>
            <th className='border border-gray-300'>Option</th>
            <th className='border border-gray-300'>Price</th>
            <th className='border border-gray-300'>Pick</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option, key) => {
            if (!table2DisplayCondition(option.provider, option.region, tempProvider, tempRegion)) return null

            const isChosen = provider === option.provider && region === option.region

            return (
              <Fragment key={key}>
                <tr>
                  <td className={tableBoldText}>
                    {option.provider} - {option.region}
                  </td>

                  <td
                    className={cn('border border-gray-300 text-right p-2', 'row-span-1', 'sm:row-span-2 sm:min-w-44')}
                  >
                    <p className={cn('hidden', 'sm:block')}>{wpClass}</p>
                    <br className={cn('hidden', 'sm:block')} />
                    {priceForCluster(option.provider, wpClass, wpNumber, cp)}
                  </td>

                  <td
                    className={cn(
                      'border border-gray-300 text-center p-2 flex justify-center items-center',
                      'row-span-1',
                      'sm:row-span-2 sm:min-w-28'
                    )}
                  >
                    {isChosen ? (
                      <span className='p-1 border rounded-md border-emerald-500 dark:border-emerald-600 text-sm'>
                        <Check />
                      </span>
                    ) : (
                      <Button type='button' onClick={() => choose(option.provider, option.region)}></Button>
                    )}
                  </td>
                </tr>

                <tr className={cn('hidden', 'sm:block')}>
                  <td className='p-2 min-w-60'>{tableClusterPriceDescription(cp, wpNumber)}</td>
                </tr>
              </Fragment>
            )
          })}
        </tbody>
      </table>

      <Controller
        name='provider'
        control={control}
        rules={{ required: 'Provider is required' }}
        render={({ field }) => <input type='hidden' {...field} />}
      />

      <Controller
        name='region'
        control={control}
        rules={{ required: 'Region is required' }}
        render={({ field }) => <input type='hidden' {...field} />}
      />

      {(errors.provider || errors.region) && (
        <div className='mt-2'>
          {errors.provider && <p className={errorTextStyling}>{errors.provider.message as string}</p>}
          {errors.region && <p className={errorTextStyling}>{errors.region.message as string}</p>}
        </div>
      )}
    </div>
  )
}
