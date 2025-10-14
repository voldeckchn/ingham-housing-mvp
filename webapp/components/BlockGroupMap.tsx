'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { BlockGroupData } from '@/lib/types'
import BlockGroupPanel from './BlockGroupPanel'

interface BlockGroupMapProps {
  predictions: BlockGroupData[]
  highlightedAreas?: string[]
  focusArea?: string | null
}

export default function BlockGroupMap({
  predictions,
  highlightedAreas = [],
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
            ['==', ['get', 'GEOID'], ''],
            '#cccccc',
            [
              'interpolate',
              ['linear'],
              ['to-number', ['get', 'GEOID', ['literal', scoresMap]], 50],
              0, '#d73027',
              50, '#fee08b',
              100, '#1a9850'
            ]
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

  // Handle highlighted areas
  useEffect(() => {
    if (!mapRef.current || !highlightedAreas.length) return

    const map = mapRef.current

    // Add highlight layer if it doesn't exist
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

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />
      {selectedBG && (
        <BlockGroupPanel
          bg={selectedBG}
          onClose={() => setSelectedBG(null)}
        />
      )}
    </div>
  )
}
