import { Option } from '@/features/cluster/types/create-cluster'

export const regions = [
  { display: 'north', key: 'north' },
  { display: 'east', key: 'east' },
  { display: 'west', key: 'west' },
  { display: 'central', key: 'central' },
  { display: 'south (test)', key: 'south' },
]

export const providers = [
  { display: 'talos', key: 'talos' },
  { display: 'tanzu', key: 'tanzu' },
  { display: 'azure', key: 'azure' },
]

export const environments = [
  { display: 'prod', key: 'prod' },
  { display: 'test', key: 'test' },
  { display: 'qa', key: 'qa' },
  { display: 'dev', key: 'dev' },
]

export const pools = [
  { display: 'best-effort-large', key: 'best-effort-large' },
  { display: 'best-effort-medium', key: 'best-effort-medium' },
  { display: 'best-effort-small', key: 'best-effort-small' },
]

export const networks = [
  { display: 't-test01', key: 't-test01' },
  { display: 't-test02', key: 't-test02' },
]

export const optionsTalos: Option[] = [
  { region: 'north', provider: 'talos', valid: false },
  { region: 'east', provider: 'talos', valid: false },
  { region: 'west', provider: 'talos', valid: true },
  { region: 'central', provider: 'talos', valid: true },
  { region: 'south', provider: 'talos', valid: true },
]

export const optionsTanzu: Option[] = [
  { region: 'north', provider: 'tanzu', valid: false },
  { region: 'east', provider: 'tanzu', valid: true },
  { region: 'west', provider: 'tanzu', valid: false },
  { region: 'central', provider: 'tanzu', valid: true },
  { region: 'south', provider: 'tanzu', valid: false },
]

export const optionsAzure: Option[] = [
  { region: 'north', provider: 'azure', valid: false },
  { region: 'east', provider: 'azure', valid: true },
  { region: 'west', provider: 'azure', valid: true },
  { region: 'central', provider: 'azure', valid: false },
  { region: 'south', provider: 'azure', valid: false },
]

export const options = [...optionsTalos, ...optionsTanzu, ...optionsAzure]
