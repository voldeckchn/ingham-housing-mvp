'use client'

import { useEffect, useState } from 'react'
import BlockGroupMap from '@/components/BlockGroupMap'
import AIAssistant from '@/components/AIAssistant'
import { BlockGroupData } from '@/lib/types'

export default function Home() {
  const [predictions, setPredictions] = useState<BlockGroupData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [highlightedAreas, setHighlightedAreas] = useState<string[]>([])
  const [spilloverAreas, setSpilloverAreas] = useState<string[]>([])
  const [focusArea, setFocusArea] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/data/bg_predictions.json')
        if (!response.ok) {
          throw new Error('Failed to load predictions')
        }
        const data = await response.json()
        setPredictions(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading housing equity model...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading data</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const handleExportCSV = () => {
    const { exportBlockGroupsCSV } = require('@/lib/csv-export')
    exportBlockGroupsCSV(predictions)
  }

  return (
    <main className="relative w-full h-screen">
      {/* Title Card */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3 w-72">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-gray-900">
            Ingham County Housing
          </h1>
          <button
            onClick={handleExportCSV}
            className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
            title="Export all block group data to CSV"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>

        <div className="text-xs text-gray-600 mb-3">
          <p className="mb-1"><strong>{predictions.length}</strong> block groups • Click any area for details</p>
          {highlightedAreas.length > 0 && (
            <p className="text-blue-600 font-medium">
              🔍 {highlightedAreas.length} areas highlighted
            </p>
          )}
        </div>

        {/* Compact Legend */}
        <div className="flex items-center gap-3 text-xs text-gray-600 pb-2 border-b">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 rounded"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-400 rounded"></div>
            <span>Med</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-600 rounded"></div>
            <span>Low</span>
          </div>
        </div>

        {/* Quick Instructions */}
        <div className="mt-2 text-xs text-gray-500">
          <p className="mb-1">💬 <strong>Ask AI:</strong> Click chat button below</p>
          <p>🗺️ <strong>Explore:</strong> Click map to view data</p>
        </div>
      </div>

      {/* Map */}
      <BlockGroupMap
        predictions={predictions}
        highlightedAreas={highlightedAreas}
        spilloverAreas={spilloverAreas}
        focusArea={focusArea}
      />

      {/* AI Assistant */}
      <AIAssistant
        onHighlightAreas={setHighlightedAreas}
        onSpilloverAreas={setSpilloverAreas}
        onFocusArea={setFocusArea}
      />
    </main>
  )
}
