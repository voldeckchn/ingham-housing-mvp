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
    <div className={`absolute ${positionClasses[position]} z-10 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 max-w-xs`}>
      <div className="text-xs font-bold text-gray-800 mb-2">Legend</div>

      {/* Equity Score Colors */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span className="text-gray-700">High Equity</span>
          </div>
          <span className="text-gray-500 text-[10px]">70+</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span className="text-gray-700">Moderate</span>
          </div>
          <span className="text-gray-500 text-[10px]">40-70</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-600 rounded"></div>
            <span className="text-gray-700">Low Equity</span>
          </div>
          <span className="text-gray-500 text-[10px]">0-40</span>
        </div>
      </div>

      {/* AI Highlights */}
      <div className="border-t border-gray-200 mt-2 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-0.5 bg-red-600"></div>
            <span className="text-gray-600">AI Selected</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-orange-400"></div>
            <span className="text-gray-600">Spillover</span>
          </div>
        </div>
      </div>
    </div>
  )
}
