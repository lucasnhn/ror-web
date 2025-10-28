import { useEffect, useState } from 'react'
import { UseVmLayoutParams, UseVmLayoutReturn } from '../utils/vms'
import type { VirtualMachine } from '@ror/js-api-client'

export const useVmLayout = ({ params }: UseVmLayoutParams): UseVmLayoutReturn => {
  const [id, setId] = useState('')
  const [vm, setVm] = useState<VirtualMachine | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVmData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const { id } = await params
        setId(id)
        const stored = localStorage.getItem('selectedVm')
        if (stored) {
          setVm(JSON.parse(stored))
        } else {
          setError('No VM data found in localStorage')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setIsLoading(false)
      }
    }

    loadVmData()
  }, [params])

  return { id, vm, isLoading, error }
}
