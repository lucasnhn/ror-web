'use client'

import { User } from '@ror/js-api-client'
import { Button } from '@/components/shadcn/button'
import { useVMContext } from '@/context/vm-context'

interface VMDetailsProps {
  user?: User
  className?: string
}

const CardHeader = ({ title }: { title: string }) => {
  return (
    <div className='mb-2'>
      <h2 className='text-xl font-semibold'>{title}</h2>
      <hr />
    </div>
  )
}

export const VMDetails = ({ user, className }: VMDetailsProps) => {
  //TODO
  // Add more information about a VM here
  // Maybe use a grid layout to show different sections
  // Use cards to separate different sections
  // Example sections: General info, Network info, Storage info, Performance metrics, etc.
  // SEE FIGMA DESIGNS

  const { vm } = useVMContext()
  return (
    <div key='info' className='drag-handle '>
      <CardHeader title='TODO: more info about VMs here' />
      {vm?.virtualmachine?.status?.operatingsystem?.hostname && (
        <div className='mb-4'>
          <h3 className='text-lg font-medium'>Hostname</h3>
          <p>{vm.virtualmachine.status.operatingsystem.hostname}</p>
        </div>
      )}
      {vm?.virtualmachine?.status?.operatingsystem?.name && (
        <div className='mb-4'>
          <h3 className='text-lg font-medium'>Operating System</h3>
          <p>{vm.virtualmachine.status.operatingsystem.name}</p>
        </div>
      )}
    </div>
  )
}
