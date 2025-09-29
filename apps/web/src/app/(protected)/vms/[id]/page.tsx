import { VMDetails } from '@/components/ui/vm/vm-details'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ROR - VM',
  description: 'View and manage VM details',
}

export default async function VMPage() {
  return (
    <div className='@container'>
      <VMDetails />
    </div>
  )
}
