'use client'

import { ColumnDef } from '@tanstack/react-table'
import type { VulnerabilityReport } from '@ror/js-api-client'
import {
  getVulnerabilityReportMetadataNamespace,
  getVulnerabilityReportCriticalCount,
  getVulnerabilityReportHighCount,
  getVulnerabilityReportMediumCount,
  getVulnerabilityReportLowCount,
  getVulnerabilityReportTotalCount,
  getVulnerabilityReportScannerName,
  getVulnerabilityReportArtifactRepository,
  getVulnerabilityReportArtifactTag,
  getVulnerabilityReportMetadataOwnerReferencesKind,
  Vulnerability,
} from '../utils/vulnerability-report'
import { Pill } from '@/components/shadcn/pill'

export const vulnerabilityReportColumns: ColumnDef<VulnerabilityReport>[] = [
  {
    id: 'expander',
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <div className='inline-flex w-fit'>
          <button
            onClick={row.getToggleExpandedHandler()}
            className='text-black dark:text-white'
            aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
          >
            {row.getIsExpanded() ? '▼' : '▶'}
          </button>
        </div>
      ) : null,
  },
  {
    header: 'Namespace',
    accessorFn: getVulnerabilityReportMetadataNamespace,
  },
  {
    header: 'Kind',
    accessorFn: getVulnerabilityReportMetadataOwnerReferencesKind,
  },
  {
    header: 'Name',
    accessorFn: getVulnerabilityReportScannerName,
  },
  {
    header: 'Repository',
    accessorFn: getVulnerabilityReportArtifactRepository,
  },
  {
    header: 'Tag',
    accessorFn: getVulnerabilityReportArtifactTag,
  },
  {
    header: 'Critical',
    accessorFn: getVulnerabilityReportCriticalCount,
  },
  {
    header: 'High',
    accessorFn: getVulnerabilityReportHighCount,
  },
  {
    header: 'Medium',
    accessorFn: getVulnerabilityReportMediumCount,
  },
  {
    header: 'Low',
    accessorFn: getVulnerabilityReportLowCount,
  },
  {
    header: 'Total',
    accessorFn: getVulnerabilityReportTotalCount,
  },
]

export const vulnerabilityReportDetailsColumns: ColumnDef<Vulnerability>[] = [
  {
    header: 'Severity',
    accessorKey: 'severity',
    cell: ({ row }) => {
      const severity = row.original.severity

      const color =
        severity === 'CRITICAL' ? 'red' : severity === 'HIGH' ? 'orange' : severity === 'MEDIUM' ? 'amber' : 'default'

      return (
        <Pill variant={color} className='brightness-90 dark:brightness-60'>
          {severity}
        </Pill>
      )
    },
  },
  {
    header: 'Score',
    accessorKey: 'score',
  },
  {
    header: 'ID',
    accessorKey: 'vulnerabilityID',
  },
  {
    header: 'Link',
    accessorKey: 'primaryLink',
    cell: ({ row }) => (
      <a
        href={row.original.primaryLink}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-500 hover:underline'
      >
        {row.original.primaryLink.split('/').pop()}
      </a>
    ),
  },
  {
    header: 'Resource',
    accessorKey: 'resource',
  },
  {
    header: 'Installed version',
    accessorKey: 'installedVersion',
  },
  {
    header: 'Fixed version',
    accessorKey: 'fixedVersion',
  },
  {
    header: 'Description',
    accessorKey: 'title',
  },
]
