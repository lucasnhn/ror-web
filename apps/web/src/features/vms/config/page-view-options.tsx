import { Option } from '@/components/shadcn/multiselect'
import { getUniqueTeams, getTeamDescription, getTeamValue } from '../utils/vms'
import type { VirtualMachine } from '@ror/js-api-client'

export const displayDataOptions: Option[] = [
  { label: 'Backup status', value: 'activeBackup' },
  { label: 'Team', value: 'team' },
  { label: 'Power', value: 'powerState' },
  { label: 'Disk usage', value: 'disk-usage' },
  { label: 'Memory', value: 'memory' },
  { label: 'CPU', value: 'cpu' },
  { label: 'ID', value: 'id' },
  { label: 'Architecture', value: 'architecture' },
  { label: 'Family', value: 'family' },
  { label: 'Version', value: 'version' },
  { label: 'VMware Tools version', value: 'toolVersion' },
]

export const sortingOptions = [
  { label: 'Hostname', value: 'hostName' },
  { label: 'Backup status', value: 'activeBackup' },
  { label: 'Team', value: 'team' },
  { label: 'Power', value: 'powerState' },
  { label: 'Disk usage', value: 'disk-usage' },
  { label: 'Memory', value: 'memory' },
  { label: 'CPU', value: 'cpu' },
  { label: 'ID', value: 'id' },
  { label: 'Architecture', value: 'architecture' },
  { label: 'Family', value: 'family' },
  { label: 'Version', value: 'version' },
  { label: 'VMware Tools version', value: 'toolVersion' },
]

export const powerStateOptions: Option[] = [
  { value: 'poweredOn', label: 'Powered On' },
  { value: 'poweredOff', label: 'Powered Off' },
  { value: 'undefined', label: 'Undefined' },
]

export const backupStatusOptions: Option[] = [
  { value: 'activeBackup', label: 'Active Backup' },
  { value: 'historicalBackup', label: 'Historical Backup' },
  { value: 'configuredBackup', label: 'Configured Backup' },
  { value: 'noBackup', label: 'No Backup' },
  // TODO: Implement these statuses in the future
  // { value: 'inProgress', label: 'In Progress' },
  // { value: 'completed', label: 'Completed' },
  // { value: 'failed', label: 'Failed' },
]

// Generate team options from VM data using team descriptions and values
export const generateTeamOptions = (vms: VirtualMachine[]): Option[] => {
  const teamOptionsSet = new Set<string>()

  vms.forEach((vm) => {
    const teamDescription = getTeamDescription(vm)
    const teamValue = getTeamValue(vm)

    // Prefer description, but fall back to value if description is empty
    if (teamDescription && teamDescription.trim()) {
      teamOptionsSet.add(teamDescription.trim())
    } else if (teamValue && teamValue.trim()) {
      teamOptionsSet.add(teamValue.trim())
    }
  })

  const options: Option[] = Array.from(teamOptionsSet)
    .sort()
    .map((teamIdentifier) => ({
      value: teamIdentifier,
      label: teamIdentifier,
    }))

  // Add "No Team" option for VMs without any team tags
  const hasVmsWithoutAnyTeamData = vms.some((vm) => !getTeamDescription(vm) && !getTeamValue(vm))
  if (hasVmsWithoutAnyTeamData) {
    options.push({ value: 'No Team', label: 'No Team' })
  }

  return options
}

// Generate detailed team options with both description and value
export const generateDetailedTeamOptions = (vms: VirtualMachine[]): Option[] => {
  const teams = getUniqueTeams(vms)

  const options: Option[] = teams.map((team) => ({
    value: team.description,
    label: `${team.description} (${team.value})`,
  }))

  // Add "No Team" option for VMs without team tags (consistent with existing filter system)
  const hasVmsWithoutTeam = vms.some((vm) => !getTeamDescription(vm))
  if (hasVmsWithoutTeam) {
    options.push({ value: 'No Team', label: 'No Team' })
  }

  return options
}

export const generateFilterOptions = (vms: VirtualMachine[]) => [
  { label: 'Power States', placeholder: 'Choose Power State', data: powerStateOptions },
  { label: 'Teams', placeholder: 'Choose Team', data: generateTeamOptions(vms) },
  { label: 'Backup', placeholder: 'Choose Backup Status', data: backupStatusOptions },
]
