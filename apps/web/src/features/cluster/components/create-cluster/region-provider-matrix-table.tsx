import { cn } from '@/utils/clsxm'
import { X } from 'lucide-react'
import { isTemp } from '@/features/cluster/config/create-cluster-helpers'
import {
  hoveredCellStyling,
  outerTableStyling,
  table1CellStyling,
  tableBlue,
  tableStyling,
} from '@/features/cluster/config/create-cluster-styling'
import { Region, Provider } from '@/features/cluster/types/create-cluster'

interface RegionOption {
  provider: Provider
  region: Region
  valid: boolean
}

interface RegionItem {
  key: Region
  display: string
}

export interface ProviderRow {
  label: string
  providerKey: Provider
  rowIndex: number
  options: RegionOption[]
}

interface RegionProviderMatrixTableProps {
  regions: RegionItem[]
  tempRegion: Region
  tempProvider: Provider
  setTempRegion: (r: Region) => void
  setTempProvider: (p: Provider) => void
  rows: ProviderRow[]
  hoverRow: number | null
  hoverCol: number | null
  setHoverRow: (v: number | null) => void
  setHoverCol: (v: number | null) => void
}

export const RegionProviderMatrixTable = ({
  regions,
  tempRegion,
  tempProvider,
  setTempRegion,
  setTempProvider,
  rows,
  hoverRow,
  hoverCol,
  setHoverRow,
  setHoverCol,
}: RegionProviderMatrixTableProps) => (
  <table className={cn(outerTableStyling, 'w-2xl table-fixed hidden sm:block')}>
    <tbody>
      {/* Header row */}
      <tr className='h-20'>
        <th className={cn(tableStyling, 'h-20')} />
        {regions.map((region, colIndex) => (
          <th
            key={region.key}
            className={cn(
              tableStyling,
              'p-4 h-20',
              hoverCol === null && hoverRow === null && isTemp(region.key, tempRegion) && tableBlue,
              hoveredCellStyling(hoverRow, hoverCol, 0, colIndex)
            )}
            onMouseEnter={() => setHoverCol(colIndex)}
            onMouseLeave={() => setHoverCol(null)}
            onClick={() => {
              setTempProvider('')
              setTempRegion(region.key)
            }}
          >
            {region.display}
          </th>
        ))}
      </tr>

      {/* Provider rows */}
      {rows.map((row, rowIndex) => (
        <tr key={row.providerKey} className='h-20'>
          <th
            className={cn(
              tableStyling,
              'p-4 h-20 transition-colors',
              hoverCol === null && hoverRow === null && isTemp(row.providerKey, tempProvider) && tableBlue,
              hoveredCellStyling(hoverRow, hoverCol, rowIndex + 1, -1)
            )}
            onMouseEnter={() => setHoverRow(rowIndex)}
            onMouseLeave={() => setHoverRow(null)}
            onClick={() => {
              setTempProvider(row.providerKey)
              setTempRegion('')
            }}
          >
            {row.label}
          </th>
          {row.options.map((option, colIndex) => (
            <td
              key={`${option.provider}-${option.region}-${colIndex}`}
              className={cn(
                hoverCol === null &&
                  hoverRow === null &&
                  table1CellStyling(option.provider, option.region, tempRegion, tempProvider),
                'h-20',
                hoveredCellStyling(hoverRow, hoverCol, row.rowIndex, colIndex)
              )}
              onMouseEnter={() => {
                setHoverRow(row.rowIndex)
                setHoverCol(colIndex)
              }}
              onMouseLeave={() => {
                setHoverRow(null)
                setHoverCol(null)
              }}
              onClick={() => {
                if (!option.valid) return
                setTempProvider(option.provider)
                setTempRegion(option.region)
              }}
            >
              {option.valid && <X className='mx-auto my-2' />}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)
