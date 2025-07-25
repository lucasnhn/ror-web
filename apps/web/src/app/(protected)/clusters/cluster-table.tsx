'use client'

import { createColumnHelper } from '@tanstack/react-table'
import type { KubernetesCluster } from '@ror/js-api-client'
import Link from 'next/link'
import { DataTable } from '@/components/ui/data-table'
import type { DataTableColumnDef, DataTablePagination } from '@/components/ui/data-table'
import { HealthStatus } from '@/components/ui/cluster/health-status'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { routes } from '@/config/routes'
import { CopyIcon, ExternalLink } from 'lucide-react'
import copy from 'clipboard-copy'
import { CopyButton } from '@ror/react'
import { User } from 'next-auth'
import { Pill } from '@/components/shadcn/pill'
import { ClusterCardDisplayData } from '@/components/ui/cluster/cluster-card'

const columnHelper = createColumnHelper<KubernetesCluster>()

export const envColors: Record<string, 'red' | 'yellow' | 'blue' | 'emerald' | 'gray'> = {
  prod: 'red',
  qa: 'yellow',
  dev: 'blue',
  test: 'emerald',
  undefined: 'gray',
}

const handleRorcliCopyButton = (copyText: string) => {
  void copy(copyText)
}

const handleKubectlCopyButton = (copyText: string) => {
  void copy(copyText)
}

const getDataTableColumns = (
  user?: User,
  selectedDisplayData?: ClusterCardDisplayData[]
): DataTableColumnDef<KubernetesCluster>[] => {
  const showAll = !selectedDisplayData || selectedDisplayData.length === 0
  const isVisible = (id: ClusterCardDisplayData) => showAll || selectedDisplayData.includes(id)

  return [
    columnHelper.accessor((row) => row.metadata.name ?? '', {
      id: 'clusterName',
      header: 'Name',
      enableSorting: true,
      sortingFn: 'text',
      cell: (info) => {
        const clusterName = String(info.getValue() ?? '')

        const clusterId = info.row.original.kubernetescluster?.spec?.data?.clusterId ?? ''

        return (
          <Link
            href={routes.app.cluster.getHref(clusterId)}
            className='pr-2 text-blue-600 dark:text-blue-500 underline'
          >
            {clusterName}
          </Link>
        )
      },
    }),
    columnHelper.accessor(() => 1, {
      // TODO: `1` with real health data later
      id: 'health',
      header: 'Status',
      enableSorting: false,
      cell: (info) => <HealthStatus status={info.getValue()} />,
    }),
    columnHelper.accessor((row) => row.kubernetescluster?.spec?.data?.environment ?? '', {
      header: 'Environment',
      enableSorting: false,
      cell: (info) => {
        const env = info.getValue()
        return (
          <Pill variant={envColors[env ?? 'undefined']} className='px-3'>
            {(env ?? 'Undefined').charAt(0).toUpperCase() + (env ?? 'Undefined').slice(1)}
          </Pill>
        )
      },
    }),
    isVisible('cpu') &&
      columnHelper.accessor(
        (row) => {
          const usage = row.kubernetescluster?.status?.state?.cluster?.resources?.cpu?.used
          return usage
        },
        {
          id: 'cpu',
          header: 'CPU',
          enableSorting: false,
          cell: (info) => {
            const usage = info.getValue()
            const cores = info.row.original.kubernetescluster?.status?.state?.cluster?.resources?.cpu?.capacity
            return (
              <span>
                {usage} ({cores} cores)
              </span>
            )
          },
        }
      ),
    isVisible('memory') &&
      columnHelper.accessor((row) => row.kubernetescluster?.status?.state?.cluster?.resources?.memory?.used, {
        id: 'memory',
        header: 'Memory',
        enableSorting: false,
        cell: (info) => {
          const usage = info.getValue()
          const memoryRaw = info.row.original.kubernetescluster?.status?.state?.cluster?.resources?.memory?.capacity
          return (
            <span>
              {usage} ({memoryRaw})
            </span>
          )
        },
      }),
    isVisible('gpu') &&
      columnHelper.accessor(
        (row) => {
          const usage = row.kubernetescluster?.status?.state?.cluster?.resources?.gpu?.used
          return usage
        },
        {
          id: 'gpu',
          header: 'GPU',
          enableSorting: false,
          cell: (info) => {
            const usage = info.getValue()
            const cores = info.row.original.kubernetescluster?.status?.state?.cluster?.resources?.gpu?.capacity
            return (
              <span>
                {usage} ({cores} cores)
              </span>
            )
          },
        }
      ),
    isVisible('disk') &&
      columnHelper.accessor((row) => row.kubernetescluster?.status?.state?.cluster?.resources?.disk?.used, {
        id: 'disk',
        header: 'Disk',
        enableSorting: false,
        cell: (info) => {
          const usage = info.getValue()
          const memoryRaw = info.row.original.kubernetescluster?.status?.state?.cluster?.resources?.disk?.capacity
          return (
            <span>
              {usage} ({memoryRaw})
            </span>
          )
        },
      }),
    isVisible('nodes') &&
      columnHelper.accessor(
        (row) => {
          const usage = row.kubernetescluster?.spec?.topology?.workers?.nodePools
          return usage
        },
        {
          id: 'nodes',
          header: 'Num of nodes',
          enableSorting: false,
          cell: (info) => {
            const nodePools = info.row.original.kubernetescluster?.spec?.topology?.workers?.nodePools
            const nodePoolsAmount = nodePools?.length || 0
            const nodeAmount = nodePools?.reduce((total, nodePool) => total + (nodePool.replicas || 0), 0) || 0
            return (
              <span>
                {nodeAmount} ({nodePoolsAmount} node pools)
              </span>
            )
          },
        }
      ),
    isVisible('monthlyPrice') &&
      columnHelper.accessor(
        (row) => {
          const usage = row.kubernetescluster?.spec?.topology?.workers?.nodePools
          return usage
        },
        {
          id: 'monthlyPrice',
          header: 'Monthly price',
          enableSorting: false,
          cell: (info) => {
            const monthlyPrice = info.row.original.kubernetescluster?.status?.state?.cluster?.price?.monthly || 0
            return <span>{monthlyPrice} kr</span>
          },
        }
      ),
    isVisible('yearlyPrice') &&
      columnHelper.accessor(
        (row) => {
          const usage = row.kubernetescluster?.spec?.topology?.workers?.nodePools
          return usage
        },
        {
          id: 'yearlyPrice',
          header: 'Yearly price',
          enableSorting: false,
          cell: (info) => {
            const yearlyPrice = info.row.original.kubernetescluster?.status?.state?.cluster?.price?.yearly || 0
            return <span>{yearlyPrice} kr</span>
          },
        }
      ),
    isVisible('agentVersion') &&
      columnHelper.accessor(
        () => {
          // TODO: Replace with real tooling data
          const tooling = 'Mock agent'
          return tooling
        },
        {
          id: 'agentVersion',
          header: 'Agent version',
          enableSorting: false,
          cell: (info) => <span>{info.getValue()}</span>,
        }
      ),
    isVisible('kubernetesVersion') &&
      columnHelper.accessor(
        () => {
          // TODO: Replace with real tooling data
          const tooling = 'Mock kubernetes'
          return tooling
        },
        {
          id: 'kubernetesVersion',
          header: 'Kubernetes version',
          enableSorting: false,
          cell: (info) => <span>{info.getValue()}</span>,
        }
      ),
    isVisible('toolingVersion') &&
      columnHelper.accessor(
        () => {
          // TODO: Replace with real tooling data
          const tooling = 'Mock tooling'
          return tooling
        },
        {
          id: 'toolingVersion',
          header: 'Tooling version',
          enableSorting: false,
          cell: (info) => <span>{info.getValue()}</span>,
        }
      ),
    isVisible('argocd') &&
      columnHelper.display({
        id: 'argocd',
        header: 'ArgoCD',
        cell: (info) => {
          const url = info.row.original.kubernetescluster?.status?.state?.endpoints?.find(
            (e) => e.name === 'argocd'
          )?.address
          return url ? (
            <a
              href={`https://${url}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 text-blue-600 dark:text-blue-500'
            >
              ArgoCD <ExternalLink className='w-5 h-5 text-current ' />
            </a>
          ) : (
            'Missing…'
          )
        },
      }),
    isVisible('grafana') &&
      columnHelper.display({
        id: 'grafana',
        header: 'Grafana',
        cell: (info) => {
          const url = info.row.original.kubernetescluster?.status?.state?.endpoints?.find(
            (e) => e.name === 'grafana'
          )?.address
          return url ? (
            <a
              href={`https://${url}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 text-blue-600 dark:text-blue-500'
            >
              Grafana <ExternalLink className='w-5 h-5 text-current' />
            </a>
          ) : (
            'Missing…'
          )
        },
      }),
    isVisible('rorcli') &&
      columnHelper.display({
        id: 'rorcli',
        header: 'ROR CLI',
        cell: (info) => {
          const clusterSpec = info.row.original.kubernetescluster?.spec
          const clusterId = clusterSpec?.data?.clusterId
          const rorLogin = `ror login ${clusterId}`

          return rorLogin ? (
            <CopyButton onClick={() => handleRorcliCopyButton(rorLogin)}>
              <CopyIcon />
            </CopyButton>
          ) : (
            'Missing…'
          )
        },
      }),
    isVisible('kubectl') &&
      columnHelper.display({
        id: 'kubectl',
        header: 'Kubectl',
        cell: (info) => {
          const clusterSpec = info.row.original.kubernetescluster?.spec
          const clusterStatus = info.row.original.kubernetescluster?.status
          const clusterName = info.row.original.metadata?.name ?? ''
          const serverUrl =
            clusterStatus?.state?.endpoints?.find((endpoint) => endpoint.name === 'datacenter')?.address || '<missing>'

          const kubectlLogin = `kubectl vsphere login --server=${serverUrl} -u ${user?.email} --insecure-skip-tls-verify --tanzu-kubernetes-cluster-namespace ${clusterSpec?.data?.workspace} --tanzu-kubernetes-cluster-name ${clusterName}`

          return kubectlLogin ? (
            <CopyButton onClick={() => handleKubectlCopyButton(kubectlLogin)}>
              <CopyIcon />
            </CopyButton>
          ) : (
            'Missing…'
          )
        },
      }),
    isVisible('datacenterName') &&
      columnHelper.accessor(
        (row) => {
          const usage = row.kubernetescluster?.spec?.data?.datacenter
          return usage
        },
        {
          id: 'datacenterName',
          header: 'Datacenter',
          enableSorting: false,
          cell: (info) => {
            const name = info.row.original.kubernetescluster?.spec?.data?.datacenter || 'Unknown'
            return <span>{name}</span>
          },
        }
      ),
    isVisible('datacenterProvider') &&
      columnHelper.accessor(
        (row) => {
          const usage = row.kubernetescluster?.spec?.data?.provider
          return usage
        },
        {
          id: 'datacenterProvider',
          header: 'Datacenter provider',
          enableSorting: false,
          cell: (info) => {
            const provider = info.row.original.kubernetescluster?.spec?.data?.provider || 'Unknown'
            return <span>{provider}</span>
          },
        }
      ),
  ].filter(Boolean) as DataTableColumnDef<KubernetesCluster>[]
}

interface ClusterTableProps {
  user?: User
  data: KubernetesCluster[]
  selectedDisplayData: ClusterCardDisplayData[]
  totalCount: number
  pageCount: number
  pagination: DataTablePagination
}

export function ClustersTable({
  user,
  data,
  selectedDisplayData,
  totalCount,
  pageCount,
  pagination,
}: ClusterTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()

  const handleOnPaginationChange = useCallback(
    (state: DataTablePagination) => {
      const params = new URLSearchParams(currentSearchParams)
      params.set('page', (state.pageIndex + 1).toString())
      params.set('limit', state.pageSize.toString())

      router.push(`${pathname}?${params.toString()}`)
    },
    [currentSearchParams, pathname, router]
  )

  return (
    <DataTable
      data={data}
      totalCount={totalCount}
      pageCount={pageCount}
      columns={getDataTableColumns(user, selectedDisplayData)}
      pagination={pagination}
      onPaginationChange={handleOnPaginationChange}
    />
  )
}
