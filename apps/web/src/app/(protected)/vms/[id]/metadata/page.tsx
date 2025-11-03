'use client'

import { useVMContext } from '@/context/vm-context'
import { getLastUpdated, getLocation, getProvider, getTags, getVmMetadataName } from '@/features/vms/utils/vms'

export default function VMMetadataPage() {
  const { vm } = useVMContext()
  const metadataName = getVmMetadataName(vm)
  const location = getLocation(vm)
  const provider = getProvider(vm)
  const tags = getTags(vm)
  const tagKey = Object.keys(tags)
  const tagDescription = tagKey.map((key) => `${key}: ${tags[key].description || 'Missing..'}`).join('\n')
  const lastUpdatedRaw = getLastUpdated(vm)
  const lastUpdated = lastUpdatedRaw
    ? new Date(lastUpdatedRaw).toLocaleString('nb-NO', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    : 'Ukjent'
  return (
    <section className='flex flex-col min-h-[300px]'>
      <div className='w-full max-w-lg bg-background border border-border rounded-xl shadow-sm p-8'>
        <h1 className='text-2xl font-bold mb-6 text-foreground'>Metadata</h1>
        <ul className='divide-y divide-border'>
          <li className='py-3 flex justify-between'>
            <span className='text-muted-foreground'>Name</span>
            <span className='font-medium text-foreground'>{metadataName}</span>
          </li>
          <li className='py-3 flex justify-between'>
            <span className='text-muted-foreground'>Location</span>
            <span className='font-medium text-foreground'>{location}</span>
          </li>
          <li className='py-3 flex justify-between'>
            <span className='text-muted-foreground'>Provider</span>
            <span className='font-medium text-foreground'>{provider}</span>
          </li>
          <li className='py-3 flex justify-between'>
            <span className='text-muted-foreground'>Last Updated</span>
            <span className='font-medium text-foreground'>{lastUpdated}</span>
          </li>
          <li className='py-3 flex justify-between'>
            <span className='text-muted-foreground'>Tags</span>
            <span className='font-medium text-foreground text-right whitespace-pre-line'>{tagDescription}</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
