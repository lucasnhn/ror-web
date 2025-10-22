import { Option } from '@/components/shadcn/multiselect'

export const displayDataOptions: Option[] = [
  { label: 'Name', value: 'os_name' },
  { label: 'ID', value: 'os_id' },
  { label: 'Power State', value: 'powerState' },
  { label: 'Architecture', value: 'os_architecture' },
  { label: 'Family', value: 'os_family' },
  { label: 'Version', value: 'os_version' },
  { label: 'Tool Version', value: 'os_toolVersion' },
]

export const sortingOptions = [
  { value: 'hostname', label: 'Hostname' },
  { value: 'name', label: 'Name' },
  { value: 'id', label: 'ID' },
  { value: 'powerstate', label: 'Power State' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'family', label: 'Family' },
  { value: 'version', label: 'Version' },
  { value: 'toolVersion', label: 'Tool Version' },
]

export const powerStateOptions: Option[] = [
  { value: 'poweredOn', label: 'Powered On' },
  { value: 'poweredOff', label: 'Powered Off' },
  { value: 'undefined', label: 'Undefined' },
]

export const filterOptions = [
  { label: 'Power States', placeholder: 'Choose Power State', data: powerStateOptions },
  { label: 'More filters', placeholder: 'More filters here', data: [] },
]
