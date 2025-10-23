/*
 * FILE OVERVIEW:
 *
 * Utility functions for exporting data as CSV or Excel files
 */

import type { WorkSheet } from 'xlsx'

type WorksheetWithCols = WorkSheet & { ['!cols']?: { wch: number }[] }

/** Converts rows to CSV */
export const toCSV = (rows: Array<Record<string, unknown>>): string => {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const esc = (v: unknown) => {
    if (v == null) return ''
    const s = String(v)
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(',')]
  for (const row of rows) lines.push(headers.map((h) => esc(row[h])).join(','))
  return lines.join('\n')
}

/** Downloads text content as a blob file */
export const downloadBlob = (content: string, filename: string, type = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Autosizes columns based on cell content */
export const autosizeCols = (rows: Array<Record<string, unknown>>) => {
  if (!rows.length) return []
  const headers = Object.keys(rows[0])
  return headers.map((h) => {
    const maxLen = Math.max(h.length, ...rows.map((r) => (r[h] == null ? 0 : String(r[h]).length)))
    return { wch: Math.min(Math.max(maxLen + 2, 10), 40) }
  })
}

/** Generic CSV export */
export const exportAsCSV = <T>(items: T[], filename: string, transform: (item: T) => Record<string, unknown>) => {
  try {
    const rows = items.map(transform)
    const csv = toCSV(rows)
    if (!csv) return console.warn('[Export] No data to export')
    downloadBlob(csv, filename)
  } catch (e) {
    console.error('[Export] CSV export failed', e)
  }
}

/** Generic Excel export */
export const exportAsExcel = async <T>(
  items: T[],
  filename: string,
  transform: (item: T) => Record<string, unknown>,
  sheetName = 'Export'
) => {
  try {
    const rows = items.map(transform)
    if (!rows.length) return console.warn('[Export] No data to export')

    const XLSX = await import('xlsx')
    const ws = XLSX.utils.json_to_sheet(rows) as WorksheetWithCols
    ws['!cols'] = autosizeCols(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, filename, { bookType: 'xlsx' })
  } catch (e) {
    console.error('[Export] Excel export failed', e)
  }
}
