import { Option } from '@/components/shadcn/multiselect'

export const displayDataOptions: Option[] = [
  { label: 'Name', value: 'name' },
  { label: 'ID', value: 'id' },
  { label: 'Power State', value: 'powerState' },
  { label: 'Architecture', value: 'architecture' },
  { label: 'Family', value: 'family' },
  { label: 'Version', value: 'version' },
  { label: 'Tool Version', value: 'toolVersion' },
]

export const sortingOptions = [
  { value: 'hostName', label: 'Hostname' },
  { value: 'name', label: 'Name' },
  { value: 'id', label: 'ID' },
  { value: 'powerState', label: 'Power State' },
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
