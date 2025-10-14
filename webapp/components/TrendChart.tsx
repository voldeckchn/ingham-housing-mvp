'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TimelineData {
  month: number
  equity_score: number
  gentrification_risk: number
  foreclosure_risk: number
}

interface TrendChartProps {
  timeline: TimelineData[]
  title?: string
  height?: number
}

export default function TrendChart({ timeline, title = "Timeline Projection", height = 300 }: TrendChartProps) {
  // Format data for recharts
  const chartData = timeline.map(point => ({
    month: `Month ${point.month}`,
    'Equity Score': Number(point.equity_score.toFixed(1)),
    'Gentrification Risk': Number(point.gentrification_risk.toFixed(1)),
    'Foreclosure Risk': Number(point.foreclosure_risk.toFixed(1))
  }))

  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Score (0-100)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px'
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="Equity Score"
            stroke="#1a9850"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Gentrification Risk"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Foreclosure Risk"
            stroke="#dc2626"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Key Insights */}
      <div className="mt-3 text-xs text-gray-600 space-y-1">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-600 rounded mr-2"></div>
          <span>Equity Score: Higher is better</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
          <span>Gentrification Risk: Lower is better</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-600 rounded mr-2"></div>
          <span>Foreclosure Risk: Lower is better</span>
        </div>
      </div>
    </div>
  )
}
