import type { VirtualMachine, User } from '@ror/js-api-client'
import { VMCardData } from '@/features/vms/types/vm-types'
import { Params } from '@/types/resources-page'
import type { VMWithBackupStatus } from '@/features/vms/backup/utils/map-backup-to-vm'

export interface VmResponse {
  resources: VirtualMachine[]
}

export interface VMCardProps {
  className?: string
  user?: User
  vm: VirtualMachine | VMWithBackupStatus
  vmDisplayData: VMCardData[]
}

export interface VMTableProps {
  metadata_name?: string
  os_id?: string | null
  powerstate?: string | null
}

export interface PageViewProps {
  className?: string
  user?: User
  vms: VirtualMachine[] | VMWithBackupStatus[]
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

export const getVmOperatingSystemId = (vm: VirtualMachine): string => {
  return vm.virtualmachine?.status?.operatingSystem?.id || 'unknown-id'
}

export const getVmHostName = (vm: VirtualMachine): string => {
  return vm.virtualmachine?.status?.operatingSystem?.hostName || 'Unknown VM'
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
export const getVmUniqueKey = (vm: VirtualMachine) => {
  const hostname = getVmHostName(vm)
  const uid = vm?.metadata?.uid
  // If both hostname and uid are available, combine them; else use whichever is available
  if (hostname && hostname !== 'Unknown VM' && uid) {
    return `${hostname}-${uid}`
  }
  if (uid) {
    return uid
  }
  // Fallback: at least use hostname (may be 'Unknown VM')
  return hostname
}
export const getVmsKey = (vms: VirtualMachine[] = []) => (Array.isArray(vms) ? vms.map(getVmUniqueKey).join('|') : '')

export const getVmExternalId = (vm: VirtualMachine) => {
  return vm?.virtualmachine?.externalId
}
