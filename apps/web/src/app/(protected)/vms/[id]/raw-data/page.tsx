/*
 * FILE OVERVIEW:
 *
 * Client component that renders the raw data view for a specific Virtual Machine (VM).
 */

'use client'

import { useVMContext } from '@/context/vm-context'
import { CodeSnippet } from '@ror/react/components/code-snippet'

export default function VMRawDataPage() {
  const { vm } = useVMContext()

  return (
    <div className=''>
      <h3>VirtualMachine</h3>
      <CodeSnippet type='multi' style={{ '--code-snippet-multi-max-height': '40rem' }}>
        {JSON.stringify(vm, null, 2)}
      </CodeSnippet>
    </div>
  )
}
