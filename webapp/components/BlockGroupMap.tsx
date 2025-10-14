'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { BlockGroupData } from '@/lib/types'
import BlockGroupPanel from './BlockGroupPanel'
import ScoreLegend from './ScoreLegend'

interface BlockGroupMapProps {
  predictions: BlockGroupData[]
  highlightedAreas?: string[]
  spilloverAreas?: string[]
  focusArea?: string | null
}

export default function BlockGroupMap({
  predictions,
  highlightedAreas = [],
  spilloverAreas = [],
  focusArea = null
}: BlockGroupMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [selectedBG, setSelectedBG] = useState<BlockGroupData | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Set Mapbox token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-84.5555, 42.7325], // Lansing, MI
      zoom: 10
    })

    map.on('load', async () => {
      // Load block group GeoJSON
      const response = await fetch('/data/ingham_block_groups.geojson')
      const geojson = await response.json()

      // Create a map of scores by GEOID
      const scoresMap: Record<string, number> = {}
      predictions.forEach(p => {
        scoresMap[p.geoid] = p.equity_score
      })

      // Add source
      map.addSource('block-groups', {
        type: 'geojson',
        data: geojson
      })

      // Add fill layer with color based on equity score
      map.addLayer({
        id: 'bg-fill',
        type: 'fill',
        source: 'block-groups',
        paint: {
          'fill-color': [
            'case',
            ['has', ['get', 'GEOID'], ['literal', scoresMap]],
            [
              'interpolate',
              ['linear'],
              ['get', ['get', 'GEOID'], ['literal', scoresMap]],
              0, '#d73027',
              30, '#fc8d59',
              50, '#fee08b',
              70, '#91cf60',
              100, '#1a9850'
            ],
            '#cccccc'  // Gray for missing data
          ],
          'fill-opacity': 0.7
        }
      })

      // Add border layer
      map.addLayer({
        id: 'bg-borders',
        type: 'line',
        source: 'block-groups',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1
        }
      })

      // Add click handler
      map.on('click', 'bg-fill', (e) => {
        if (e.features && e.features[0]) {
          const geoid = e.features[0].properties?.GEOID
          const data = predictions.find(p => p.geoid === geoid)
          if (data) {
            setSelectedBG(data)
          }
        }
      })

      // Change cursor on hover
      map.on('mouseenter', 'bg-fill', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'bg-fill', () => {
        map.getCanvas().style.cursor = ''
      })
    })

    mapRef.current = map

    return () => {
      map.remove()
    }
  }, [predictions])

  // Handle highlighted areas (primary selection - red)
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current

    if (!map.getLayer('bg-highlights')) {
      map.addLayer({
        id: 'bg-highlights',
        type: 'line',
        source: 'block-groups',
        paint: {
          'line-color': '#ff0000',
          'line-width': 3
        },
        filter: ['in', 'GEOID', ...highlightedAreas]
      })
    } else {
      map.setFilter('bg-highlights', ['in', 'GEOID', ...highlightedAreas])
    }
  }, [highlightedAreas])

  // Handle spillover areas (secondary effect - orange dashed)
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current

    if (!map.getLayer('bg-spillover')) {
      map.addLayer({
        id: 'bg-spillover',
        type: 'line',
        source: 'block-groups',
        paint: {
          'line-color': '#fb923c',
          'line-width': 2,
          'line-dasharray': [2, 2]
        },
        filter: ['in', 'GEOID', ...spilloverAreas]
      })

      // Add subtle fill for spillover areas
      map.addLayer({
        id: 'bg-spillover-fill',
        type: 'fill',
        source: 'block-groups',
        paint: {
          'fill-color': '#fb923c',
          'fill-opacity': 0.15
        },
        filter: ['in', 'GEOID', ...spilloverAreas]
      }, 'bg-fill') // Insert below the main fill layer
    } else {
      map.setFilter('bg-spillover', ['in', 'GEOID', ...spilloverAreas])
      map.setFilter('bg-spillover-fill', ['in', 'GEOID', ...spilloverAreas])
    }
  }, [spilloverAreas])

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Legend */}
      <ScoreLegend position="bottom-right" />

      {/* Selected Block Group Panel */}
      {selectedBG && (
        <BlockGroupPanel
          bg={selectedBG}
          onClose={() => setSelectedBG(null)}
        />
      )}
    </div>
  )
}
