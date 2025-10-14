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
      </div>

      {/* Map */}
      <BlockGroupMap
        predictions={predictions}
        highlightedAreas={highlightedAreas}
        focusArea={focusArea}
      />

      {/* AI Assistant */}
      <AIAssistant
        onHighlightAreas={setHighlightedAreas}
        onFocusArea={setFocusArea}
      />
    </main>
  )
}
