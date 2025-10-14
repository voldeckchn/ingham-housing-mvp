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
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">
          Ingham County Housing Equity
        </h1>
        <p className="text-sm text-gray-600 mb-2">
          {predictions.length} Census Block Groups analyzed
        </p>
        {highlightedAreas.length > 0 && (
          <div className="mt-2 text-xs text-blue-600 font-medium">
            🔍 Showing {highlightedAreas.length} areas from AI query
          </div>
        )}
        <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded mr-1"></div>
            <span>High Equity</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded mr-1"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded mr-1"></div>
            <span>Low Equity</span>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export All Data (CSV)
        </button>
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
