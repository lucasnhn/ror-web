/**
 * VMs Table Component
 *
 * FILE OVERVIEW:
 * ------------------------
 * This file defines a React component that displays a table of Virtual Machines (VMs).
 * It renders a table of Virtual Machines with various attributes.
 *
 */

import { User } from 'next-auth'
import { VirtualMachine } from '@/features/vms/utils/vms'
import { VMCardData } from '@/features/vms/components/vm-card'
import { DataTable } from '@/components/ui/data-table'
import { getVMTableColumns } from '@/features/vms/components/vm-columns'

interface VMTableProps {
  user?: User
  vms: VirtualMachine[]
  selectedDisplayData?: VMCardData[]
}

export function VMTable({ user, vms, selectedDisplayData }: VMTableProps) {
  return <DataTable data={vms} columns={getVMTableColumns(user, selectedDisplayData)} />
}
