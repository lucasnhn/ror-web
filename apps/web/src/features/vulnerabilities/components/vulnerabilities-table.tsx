'use client'

import { DataTable } from '@/components/ui/data-table'
import {
  vulnerabilityReportColumns,
  vulnerabilityReportDetailsColumns,
} from '@/features/vulnerabilities/components/vulnerabilities-columns'
import type { Vulnerability } from '@/features/vulnerabilities/utils/vulnerability-report'
import type { VulnerabilityReport } from '@ror/js-api-client'
import { TableRow, TableCell } from '@ror/react/components/table/table'

export const VulnerabilitiesTable = ({ items }: { items: VulnerabilityReport[] }) => (
  <DataTable<VulnerabilityReport>
    columns={vulnerabilityReportColumns}
    expandable
    data={items}
    renderExpandedRow={(row) => {
      const vulnerabilities = row.original.vulnerabilityreport.report.vulnerabilities

      return (
        <TableRow className='contents'>
          <TableCell colSpan={vulnerabilityReportColumns.length + 1} className='p-0' style={{ gridColumn: '1 / -1' }}>
            <div className='w-full bg-[var(--r-layer-1)] brightness-110 dark:brightness-140 px-4 py-4'>
              <div className='overflow-auto'>
                <div className='inline-block min-w-full align-middle'>
                  <DataTable<Vulnerability> columns={vulnerabilityReportDetailsColumns} data={vulnerabilities} />
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )
    }}
  />
)
