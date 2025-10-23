/*
 * FILE OVERVIEW:
 *
 * Utility functions for exporting Virtual Machine data in various formats.
 */

import { exportAsCSV, exportAsExcel } from '@/utils/export-utils'
import type { VirtualMachine } from '../utils/vms'

/**
 * Extracts exportable properties from a VirtualMachine object.
 *
 * Returns an object containing key details such as name, id, hostname,
 * power state, operating system family, version, architecture, and tool version.
 * Falls back to default values if certain properties are missing.
 *
 * @param vm - The VirtualMachine object to extract properties from.
 * @returns An object with exportable VM properties.
 */
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

/**
 * Exports an array of VirtualMachine objects as a CSV file.
 *
 * @param vms - The array of VirtualMachine instances to export.
 * @param filename - The desired name for the exported CSV file.
 * @returns A promise or result from the exportAsCSV utility function.
 */
export const exportVmsAsCSV = (vms: VirtualMachine[], filename: string) => exportAsCSV(vms, filename, exportableFromVm)

export const exportVmsAsExcel = (vms: VirtualMachine[], filename: string) =>
  exportAsExcel(vms, filename, exportableFromVm, 'Virtual Machines')
