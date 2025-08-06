'use client'

import { DataTable } from '@/components/ui/data-table'
import { Node } from '@ror/js-api-client'
import { ColumnDef } from '@tanstack/react-table'

interface PageViewProps<TData> {
  data: TData[]
}

export const NodesDataView = ({ data }: PageViewProps<Node>) => {
  console.log('[PAGEVIEW NODES]:', data)

  const columns: ColumnDef<Node>[] = [
    {
      header: 'Name',
      accessorFn: (row) => row.metadata?.name ?? 'Unnamed',
    },
    {
      header: 'CPU',
      accessorFn: (row) => row.node?.status?.capacity?.cpu ?? '0',
    },
    {
      header: 'Memory',
      accessorFn: (row) => row.node?.status?.capacity?.memory ?? '0',
    },
    {
      header: 'Ephemeral storage',
      accessorFn: (row) => row.node?.status?.capacity?.ephemeralStorage ?? '0',
    },
    {
      header: 'Taints',
      accessorFn: (row) => row.node?.spec?.taints?.map((taint) => `${taint.key}=${taint.effect}`).join(', ') ?? '0',
    },
    {
      header: 'Pods',
      accessorFn: (row) => row.node?.status?.capacity?.pods ?? '0',
    },
    {
      header: 'Operating system',
      accessorFn: (row) => row.node?.status?.nodeInfo?.operatingSystem ?? 'Unknown',
    },
    {
      header: 'OS Image',
      accessorFn: (row) => row.node?.status?.nodeInfo?.osImage ?? 'Unknown',
    },
    {
      header: 'Architecture',
      accessorFn: (row) => row.node?.status?.nodeInfo?.architecture ?? 'Unknown',
    },
    {
      header: 'Conditions',
      accessorFn: (row) =>
        row.node?.status?.conditions
          ?.map(
            (condition) =>
              `${condition.lastHeartbeatTime}, ${condition.lastTransitionTime}, ${condition.message}, ${condition.reason}, ${condition.status}, ${condition.type}`
          )
          .join(', ') ?? '0',
    },
    {
      header: 'PodCIDR',
      accessorFn: (row) => row.node?.spec?.podCIDR ?? '0',
    },
    {
      header: 'PodCIDRs',
      accessorFn: (row) => row.node?.spec?.podCIDRs ?? '0',
    },
    {
      header: 'Boot ID',
      accessorFn: (row) => row.node?.status?.nodeInfo?.bootID ?? '0',
    },
    {
      header: 'Container runtime version',
      accessorFn: (row) => row.node?.status?.nodeInfo?.containerRuntimeVersion ?? '0',
    },
    {
      header: 'Kernel version',
      accessorFn: (row) => row.node?.status?.nodeInfo?.kernelVersion ?? '0',
    },
    {
      header: 'Kubelet version',
      accessorFn: (row) => row.node?.status?.nodeInfo?.kubeletVersion ?? '0',
    },
    {
      header: 'Machine ID',
      accessorFn: (row) => row.node?.status?.nodeInfo?.machineID ?? '0',
    },
    {
      header: 'System UUID',
      accessorFn: (row) => row.node?.status?.nodeInfo?.systemUUID ?? '0',
    },
  ]

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Nodes</h1>
      <DataTable columns={columns} data={data} totalCount={data.length} />
    </div>
  )
}
