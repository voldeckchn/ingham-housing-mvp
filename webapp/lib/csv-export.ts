import { BlockGroupData } from './types'

/**
 * Convert array of objects to CSV string
 */
export function jsonToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return ''

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0])

  // Create header row
  const headerRow = csvHeaders.join(',')

  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header]
      // Handle values that need quotes (contain commas, quotes, or newlines)
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value ?? ''
    }).join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Export block group predictions to CSV
 */
export function exportBlockGroupsCSV(predictions: BlockGroupData[], filename?: string) {
  const csvContent = jsonToCSV(predictions, [
    'geoid',
    'name',
    'equity_score',
    'gentrification_risk',
    'foreclosure_risk',
    'median_income',
    'median_price',
    'population',
    'days_on_market',
    'price_yoy_change'
  ])

  const defaultFilename = filename || `ingham-housing-equity-${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csvContent, defaultFilename)
}

/**
 * Export single block group to CSV
 */
export function exportSingleBlockGroupCSV(blockGroup: BlockGroupData) {
  const csvContent = jsonToCSV([blockGroup])
  const filename = `block-group-${blockGroup.geoid}.csv`
  downloadCSV(csvContent, filename)
}

/**
 * Export causal loop timeline to CSV
 */
export function exportTimelineCSV(timeline: any[], geoid: string) {
  const csvContent = jsonToCSV(timeline, [
    'month',
    'equity_score',
    'gentrification_risk',
    'foreclosure_risk',
    'median_income',
    'median_price'
  ])

  const filename = `simulation-timeline-${geoid}-${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csvContent, filename)
}
