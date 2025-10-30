import { User } from 'next-auth'
import { VMCardData } from '@/features/vms/types/vm-types'
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

export const getVmDisks = (vm: VirtualMachine) => {
  return vm.virtualmachine?.status?.disks || []
}

export const getVmDiskSizes = (vm: VirtualMachine): number[] => {
  const disks = getVmDisks(vm)
  return disks.map((disk) => disk.sizeBytes || 0)
}

export const getVmDiskUsages = (vm: VirtualMachine): number[] => {
  const disks = getVmDisks(vm)
  return disks.map((disk) => disk.usageBytes || 0)
}

// export const getVmTotalDiskSize = (vm: VirtualMachine): number => {
//   const sizes = getVmDiskSizes(vm)
//   return sizes.reduce((total, size) => total + size, 0)
// }

// export const getVmTotalDiskUsage = (vm: VirtualMachine): number => {
//   const usages = getVmDiskUsages(vm)
//   return usages.reduce((total, usage) => total + usage, 0)
// }

// export const getVmDiskUtilization = (vm: VirtualMachine): number => {
//   const totalSize = getVmTotalDiskSize(vm)
//   const totalUsage = getVmTotalDiskUsage(vm)
//   return totalSize > 0 ? (totalUsage / totalSize) * 100 : 0
// }

// export const getVmDiskInfo = (vm: VirtualMachine) => {
//   const disks = getVmDisks(vm)
//   return disks.map(disk => ({
//     id: disk.id,
//     name: disk.name,
//     sizeBytes: disk.sizeBytes || 0,
//     usageBytes: disk.usageBytes || 0,
//     type: disk.type,
//     isMounted: disk.isMounted,
//     utilizationPercent: disk.sizeBytes ? ((disk.usageBytes || 0) / disk.sizeBytes) * 100 : 0
//   }))
// }

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

export const getNetworkId = (network: Network): string => {
  return network?.id ?? 'unknown-id'
}

export const getVmOperatingSystem = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.status?.operatingSystem
}

export const getVmSpec = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.spec
}

export const getTeamName = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.status?.tags?.team?.description
}

export const getTeamValue = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.status?.tags?.team?.value
}

export const getAdGroup = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.status?.tags?._AdGroup?.value
}

export const serviceIdDescription = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.status?.tags?.serviceId?.description
}

export const serviceIdValue = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.status?.tags?.serviceId?.value
}

export const getVmMetadataName = (vm: VirtualMachine) => {
  return vm?.metadata?.name
}

export const getLastUpdated = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.status?.lastUpdated
}

export const getLocation = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.status?.location
}

export const getProvider = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.provider
}

export const getTags = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.status?.tags || {}
}
