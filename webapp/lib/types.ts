export interface BlockGroupData {
  geoid: string
  name: string
  equity_score: number
  gentrification_risk: number
  foreclosure_risk: number
  median_income: number
  median_price: number
  population: number
  days_on_market: number
  price_yoy_change: number
}

export interface MapProps {
  predictions: BlockGroupData[]
  highlightedAreas?: string[]
  focusArea?: string | null
}
