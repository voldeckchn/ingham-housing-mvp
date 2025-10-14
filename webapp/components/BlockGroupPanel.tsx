'use client'

import { BlockGroupData } from '@/lib/types'

interface Props {
  bg: BlockGroupData
  onClose: () => void
}

export default function BlockGroupPanel({ bg, onClose }: Props) {
  const getScoreColor = (score: number) => {
    if (score > 70) return '#1a9850'
    if (score > 40) return '#f9a825'
    return '#d73027'
  }

  const getScoreLabel = (score: number) => {
    if (score > 70) return 'Strong equity'
    if (score > 40) return 'Moderate equity'
    return 'Low equity'
  }

  const handleExportCSV = () => {
    const { exportSingleBlockGroupCSV } = require('@/lib/csv-export')
    exportSingleBlockGroupCSV(bg)
  }

  return (
    <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">Block Group Details</h2>
          <p className="text-xs text-gray-500 font-mono mt-1">{bg.geoid}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-light"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        {/* Equity Score */}
        <div>
          <div className="text-sm text-gray-600">Housing Equity Score</div>
          <div
            className="text-4xl font-bold"
            style={{ color: getScoreColor(bg.equity_score) }}
          >
            {bg.equity_score.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getScoreLabel(bg.equity_score)}
          </div>
        </div>

        {/* Risk Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Gentrification Risk</div>
            <div className="text-2xl font-bold text-orange-600">
              {bg.gentrification_risk.toFixed(1)}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Foreclosure Risk</div>
            <div className="text-2xl font-bold text-red-600">
              {bg.foreclosure_risk.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Demographics & Market Data */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-xs text-gray-600">Median Income</div>
            <div className="text-lg font-semibold">
              {bg.median_income > 0
                ? `$${(bg.median_income / 1000).toFixed(0)}k`
                : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Median Price</div>
            <div className="text-lg font-semibold">
              {bg.median_price > 0
                ? `$${(bg.median_price / 1000).toFixed(0)}k`
                : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Population</div>
            <div className="text-lg font-semibold">
              {bg.population.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Days on Market</div>
            <div className="text-lg font-semibold">
              {bg.days_on_market} days
            </div>
          </div>
        </div>

        {/* Price Change */}
        {bg.price_yoy_change !== 0 && (
          <div className="pt-4 border-t">
            <div className="text-xs text-gray-600">Price Change (YoY)</div>
            <div
              className={`text-lg font-semibold ${
                bg.price_yoy_change > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {bg.price_yoy_change > 0 ? '+' : ''}
              {(bg.price_yoy_change * 100).toFixed(1)}%
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="pt-4 border-t">
          <button
            onClick={handleExportCSV}
            className="w-full px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data (CSV)
          </button>
        </div>
      </div>
    </div>
  )
}
