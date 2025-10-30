import { Option } from '@/components/shadcn/multiselect'

export const displayDataOptions: Option[] = [
  { label: 'OS-version', value: 'name' },
  { label: 'ID', value: 'id' },
  { label: 'Power', value: 'powerState' },
  { label: 'Architecture', value: 'architecture' },
  //{ label: 'OS-type', value: 'family' },
  { label: 'Version', value: 'version' },
  { label: 'VMware Tools version', value: 'toolVersion' },
  { label: 'Disk Size', value: 'disk-size' },
  { label: 'Memory', value: 'memory' },
  { label: 'CPU', value: 'cpu' },
  { label: 'Team', value: 'team' },
]

export const sortingOptions = [
  { value: 'hostName', label: 'Hostname' },
  { value: 'name', label: 'OS-version' },
  { value: 'id', label: 'ID' },
  { value: 'powerState', label: 'Power' },
  { value: 'architecture', label: 'Architecture' },
  //{ value: 'family', label: 'OS-type' },
  { value: 'version', label: 'Version' },
  { value: 'toolVersion', label: 'VMware Tools version' },
  { value: 'disk-size', label: 'Disk Size' },
  { value: 'memory', label: 'Memory' },
  { value: 'cpu', label: 'CPU' },
  { value: 'team', label: 'Team' },
]

export const powerStateOptions: Option[] = [
  { value: 'poweredOn', label: 'Powered On' },
  { value: 'poweredOff', label: 'Powered Off' },
  { value: 'undefined', label: 'Undefined' },
]

export const teamOptions: Option[] = [
  { value: 'Linux driftsplattform', label: 'Linux driftsplattform' },
  { value: 'Windows Driftsplatform', label: 'Windows Driftsplatform' },
]

export const filterOptions = [
  { label: 'Power States', placeholder: 'Choose Power State', data: powerStateOptions },
  { label: 'Teams', placeholder: 'Choose Team', data: teamOptions },
  { label: 'More filters', placeholder: 'More filters here', data: [] },
]
