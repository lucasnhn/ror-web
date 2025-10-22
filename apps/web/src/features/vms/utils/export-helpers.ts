import { exportAsCSV, exportAsExcel } from '@/utils/export-utils'
import type { VirtualMachine } from '../utils/vms'

const exportableFromVm = (vm: VirtualMachine) => {
  const os = vm.virtualmachine?.status?.operatingsystem ?? {}
  const spec = vm.virtualmachine?.spec ?? {}

  return {
    name: vm.metadata?.name ?? spec.name ?? '',
    id: vm.id ?? '',
    hostname: os.hostname ?? '',
    powerState: os.powerstate ?? '',
    family: os.family ?? '',
    version: os.version ?? '',
    architecture: os.architecture ?? '',
    toolVersion: os.toolversion ?? '',
  }
}

export const exportVmsAsCSV = (vms: VirtualMachine[], filename: string) => exportAsCSV(vms, filename, exportableFromVm)

export const exportVmsAsExcel = (vms: VirtualMachine[], filename: string) =>
  exportAsExcel(vms, filename, exportableFromVm, 'Virtual Machines')
