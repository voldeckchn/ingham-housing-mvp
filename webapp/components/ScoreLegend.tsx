'use client'

interface ScoreLegendProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  compact?: boolean
}

export default function ScoreLegend({ position = 'bottom-left', compact = false }: ScoreLegendProps) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  if (compact) {
    return (
      <div className={`absolute ${positionClasses[position]} z-10 bg-white rounded-lg shadow-md p-3`}>
        <div className="text-xs font-semibold text-gray-700 mb-2">Equity Score</div>
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
            <span>High (70-100)</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
            <span>Moderate (40-70)</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span>Low (0-40)</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`absolute ${positionClasses[position]} z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm`}>
      <h3 className="text-sm font-bold text-gray-800 mb-3">Map Legend</h3>

      {/* Equity Score Colors */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-700 mb-2">Housing Equity Score</div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
              <span>High Equity</span>
            </div>
            <span className="text-gray-500">70-100</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
              <span>Moderate</span>
            </div>
            <span className="text-gray-500">40-70</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
              <span>Low Equity</span>
            </div>
            <span className="text-gray-500">0-40</span>
          </div>
        </div>
      </div>

      {/* AI Query Highlights */}
      <div className="border-t pt-3">
        <div className="text-xs font-semibold text-gray-700 mb-2">AI Query Highlights</div>
        <div className="space-y-1.5">
          <div className="flex items-center text-xs">
            <div className="w-4 h-1 bg-red-600 mr-2"></div>
            <span>Primary Selection</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-4 h-1 bg-orange-400 mr-2" style={{ borderTop: '2px dashed' }}></div>
            <span>Spillover Effect</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="border-t pt-3 mt-3">
        <div className="text-xs text-gray-600">
          <p className="mb-1"><strong>Click</strong> any area to view details</p>
          <p><strong>Ask AI</strong> to highlight specific areas</p>
        </div>
      </div>
    </div>
  )
}
