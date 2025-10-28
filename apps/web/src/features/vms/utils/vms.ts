import { User } from 'next-auth'
import { VMCardData } from '@/features/vms/types/vm-card-type'
import type { VirtualMachine } from '@ror/js-api-client'
import { Params } from '@/types/resources-page'

export interface VmResponse {
  resources: VirtualMachine[]
}

export interface VMCardProps {
  className?: string
  user?: User
  vm: VirtualMachine
  vmDisplayData: VMCardData[]
}

export interface VMTableProps {
  metadata_name?: string
  os_id?: string | null
  powerstate?: string | null
}

export interface PageViewProps {
  className?: string
  user: User
  vms: VirtualMachine[]
  params: Params
}

export interface Network {
  dns?: string
  gateway?: string
  id: string
  ipv4?: string
  ipv6?: string
  mac?: string
  mask?: string
}

export interface VMDetailsProps {
  user?: User
  className?: string
}

export interface VmSearchProps {
  items: VirtualMachine[]
  onSelect?: (item: VirtualMachine) => void
  onResultsChange?: (results: VirtualMachine[]) => void
}

export interface UseVmLayoutParams {
  params: Promise<{ id: string }>
}

export interface UseVmLayoutReturn {
  id: string
  vm: VirtualMachine | null
  isLoading: boolean
  error: string | null
}

export const getVmId = (vm: VirtualMachine): string => {
  return vm.virtualmachine?.status?.operatingSystem?.id || vm.metadata?.name || vm.metadata?.uid || 'unknown-id'
}

export const getVmHostName = (vm: VirtualMachine): string => {
  return vm.virtualmachine?.status?.operatingSystem?.hostName || vm.metadata?.name || 'unnamed-vm'
}

export const getVmPowerState = (vm: VirtualMachine): string => {
  return vm.virtualmachine?.status?.operatingSystem?.powerState || 'undefined'
}

export const getVmName = (vm: VirtualMachine): string => {
  return (
    vm.virtualmachine?.status?.operatingSystem?.name ||
    vm.virtualmachine?.spec?.name ||
    vm.metadata?.name ||
    'unnamed-vm'
  )
}

export const getVmFamily = (vm: VirtualMachine): string => {
  return vm.virtualmachine?.status?.operatingSystem?.family || 'Unknown'
}

export const getVmArchitecture = (vm: VirtualMachine): string => {
  return vm.virtualmachine?.status?.operatingSystem?.architecture || 'Unknown'
}

export const getVmVersion = (vm: VirtualMachine): string => {
  return vm.virtualmachine?.status?.operatingSystem?.version || 'Unknown'
}

export const getVmToolVersion = (vm: VirtualMachine): string => {
  return vm.virtualmachine?.status?.operatingSystem?.toolVersion || 'Unknown'
}

export const getSpecSockets = (vm: VirtualMachine): number | undefined => {
  return vm?.virtualmachine?.spec?.cpu?.sockets ?? undefined
}

export const getSpecCoresPerSocket = (vm: VirtualMachine): number | undefined => {
  return vm?.virtualmachine?.spec?.cpu?.coresPerSocket ?? undefined
}

export const getStatusCpuUsage = (vm: VirtualMachine): number | undefined => {
  return vm?.virtualmachine?.status?.cpu?.usage ?? undefined
}

export const getSpecMemory = (vm: VirtualMachine): number | undefined => {
  return vm?.virtualmachine?.spec?.memory?.sizeBytes ?? undefined
}
export const getNetworks = (vm: VirtualMachine): Network[] => {
  const networks = vm?.virtualmachine?.status?.networks ?? []
  return networks.map((networkitems) => ({
    dns: networkitems?.dns ?? undefined,
    gateway: networkitems?.gateway ?? undefined,
    id: networkitems?.id ?? 'Missing ID',
    ipv4: networkitems?.ipv4 ?? undefined,
    ipv6: networkitems?.ipv6 ?? undefined,
    mac: networkitems?.mac ?? undefined,
    mask: networkitems?.mask ?? undefined,
  }))
}

export const getVmOperatingSystem = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.status?.operatingSystem
}
