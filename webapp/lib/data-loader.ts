import { BlockGroupData } from './types'

export async function loadPredictions(): Promise<BlockGroupData[]> {
  const response = await fetch('/data/bg_predictions.json')
  if (!response.ok) {
    throw new Error('Failed to load predictions')
  }
  return response.json()
}

export async function loadBlockGroupGeometry() {
  const response = await fetch('/data/ingham_block_groups.geojson')
  if (!response.ok) {
    throw new Error('Failed to load block group boundaries')
  }
  return response.json()
}
