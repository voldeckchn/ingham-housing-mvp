import { BlockGroupData } from './types'

export interface CausalLoopState {
  month: number
  equity_score: number
  gentrification_risk: number
  foreclosure_risk: number
  median_income: number
  median_price: number
}

export interface Intervention {
  type: 'htf_investment' | 'income_support' | 'rent_control'
  amount: number
  duration: number
}

export interface CausalLoopResult {
  intervention: Intervention
  baseline: BlockGroupData
  timeline: CausalLoopState[]
  finalState: CausalLoopState
  totalChange: {
    equity_score: number
    gentrification_risk: number
    foreclosure_risk: number
  }
  feedbackLoops: {
    name: string
    type: 'reinforcing' | 'balancing'
    strength: number
  }[]
}

export interface SpilloverResult {
  primary: {
    geoid: string
    equity_score_change: number
    gentrification_risk_change: number
    foreclosure_risk_change: number
  }
  spillover: {
    geoid: string
    equity_score_change: number
    gentrification_risk_change: number
    distance: string
  }[]
  total_households_impacted: number
}

/**
 * Simulate causal loop dynamics over time with feedback effects
 * Implements 3 core feedback loops from the comprehensive model:
 * 1. Gentrification Spiral (Reinforcing)
 * 2. Foreclosure-Price Cycle (Balancing)
 * 3. Equity Investment Cycle (Mixed)
 */
export function simulateCausalLoop(
  blockGroup: BlockGroupData,
  intervention: Intervention
): CausalLoopResult {
  // Initialize state
  let state: CausalLoopState = {
    month: 0,
    equity_score: blockGroup.equity_score,
    gentrification_risk: blockGroup.gentrification_risk,
    foreclosure_risk: blockGroup.foreclosure_risk,
    median_income: blockGroup.median_income,
    median_price: blockGroup.median_price
  }

  const timeline: CausalLoopState[] = [{ ...state }]

  // Identify feedback loops
  const feedbackLoops = [
    {
      name: 'HTF Investment → Equity ↑ → Attracts More Investment',
      type: 'reinforcing' as const,
      strength: 0.3
    },
    {
      name: 'Equity ↑ → Gentrification Risk ↑ (unintended consequence)',
      type: 'reinforcing' as const,
      strength: 0.1
    },
    {
      name: 'Foreclosure Risk ↓ → Price Stability → Gent Risk ↓',
      type: 'balancing' as const,
      strength: -0.2
    }
  ]

  // Simulate each month
  for (let month = 1; month <= intervention.duration; month++) {
    // Apply intervention effect (diminishes over time)
    const interventionStrength = Math.exp(-month / 6) // Decay factor

    let equityChange = 0
    let gentRiskChange = 0
    let foreRiskChange = 0

    // Direct intervention effects
    if (intervention.type === 'htf_investment') {
      // HTF investment improves equity, reduces displacement risk
      equityChange = (intervention.amount / 1000000) * 5 * interventionStrength
      gentRiskChange = -(intervention.amount / 1000000) * 3 * interventionStrength
      foreRiskChange = -(intervention.amount / 500000) * 2 * interventionStrength
    } else if (intervention.type === 'income_support') {
      // Income support (percentage increase)
      const incomeBoost = intervention.amount / 100
      equityChange = incomeBoost * 10 * interventionStrength
      foreRiskChange = -incomeBoost * 8 * interventionStrength
    } else if (intervention.type === 'rent_control') {
      // Rent control stabilizes but may reduce investment
      gentRiskChange = -(intervention.amount / 100) * 15 * interventionStrength
      equityChange = (intervention.amount / 100) * 5 * interventionStrength
    }

    // CAUSAL LOOP FEEDBACK (simplified from PDF page 26)
    // Loop 1: Gentrification → Foreclosures → Displacement
    const gentFeedback = (state.gentrification_risk / 100) * 0.5
    foreRiskChange += gentFeedback * 2

    // Loop 2: Foreclosures → Price Drop → Lower Gentrification (negative feedback)
    const foreclosureFeedback = (state.foreclosure_risk / 100) * 0.3
    gentRiskChange -= foreclosureFeedback * 1.5

    // Loop 3: High Equity → Attracts Investment → May Increase Gentrification
    const equityFeedback = (state.equity_score / 100) * 0.2
    gentRiskChange += equityFeedback * 0.5

    // Update state
    state = {
      month,
      equity_score: Math.max(0, Math.min(100, state.equity_score + equityChange)),
      gentrification_risk: Math.max(0, Math.min(100, state.gentrification_risk + gentRiskChange)),
      foreclosure_risk: Math.max(0, Math.min(100, state.foreclosure_risk + foreRiskChange)),
      median_income: state.median_income,
      median_price: state.median_price
    }

    timeline.push({ ...state })
  }

  const finalState = timeline[timeline.length - 1]

  return {
    intervention,
    baseline: blockGroup,
    timeline,
    finalState,
    totalChange: {
      equity_score: finalState.equity_score - blockGroup.equity_score,
      gentrification_risk: finalState.gentrification_risk - blockGroup.gentrification_risk,
      foreclosure_risk: finalState.foreclosure_risk - blockGroup.foreclosure_risk
    },
    feedbackLoops
  }
}

/**
 * Simulate how intervention in one area affects adjacent block groups
 */
export function simulateSpilloverEffects(
  blockGroup: BlockGroupData,
  neighbors: BlockGroupData[],
  intervention: Intervention
): SpilloverResult {
  // Primary area gets full effect
  const primaryEffect = intervention.amount / 200000 * 5

  // Neighbors get 30% spillover effect
  const spilloverEffect = primaryEffect * 0.3

  return {
    primary: {
      geoid: blockGroup.geoid,
      equity_score_change: primaryEffect,
      gentrification_risk_change: -primaryEffect * 0.6,
      foreclosure_risk_change: -primaryEffect * 0.8
    },
    spillover: neighbors.map(n => ({
      geoid: n.geoid,
      equity_score_change: spilloverEffect,
      gentrification_risk_change: -spilloverEffect * 0.6,
      distance: 'adjacent'
    })),
    total_households_impacted: blockGroup.population + neighbors.reduce((sum, n) => sum + n.population, 0)
  }
}

/**
 * Find top N block groups by a specific metric
 */
export function findTopAreas(
  predictions: BlockGroupData[],
  metric: keyof BlockGroupData,
  limit: number = 5,
  order: 'highest' | 'lowest' = 'highest'
): BlockGroupData[] {
  const sorted = [...predictions].sort((a, b) => {
    const aVal = a[metric] as number
    const bVal = b[metric] as number
    return order === 'highest' ? bVal - aVal : aVal - bVal
  })
  return sorted.slice(0, limit)
}

/**
 * Compare two block groups
 */
export function compareBlockGroups(
  bg1: BlockGroupData,
  bg2: BlockGroupData
) {
  return {
    comparison: {
      equity_score_diff: bg1.equity_score - bg2.equity_score,
      gentrification_risk_diff: bg1.gentrification_risk - bg2.gentrification_risk,
      foreclosure_risk_diff: bg1.foreclosure_risk - bg2.foreclosure_risk,
      income_diff: bg1.median_income - bg2.median_income,
      price_diff: bg1.median_price - bg2.median_price
    },
    bg1,
    bg2
  }
}

/**
 * Get statistical summary of all block groups
 */
export function getAreaStatistics(predictions: BlockGroupData[]) {
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length

  return {
    count: predictions.length,
    equity_score: {
      mean: avg(predictions.map(p => p.equity_score)),
      min: Math.min(...predictions.map(p => p.equity_score)),
      max: Math.max(...predictions.map(p => p.equity_score))
    },
    gentrification_risk: {
      mean: avg(predictions.map(p => p.gentrification_risk)),
      high_risk_count: predictions.filter(p => p.gentrification_risk > 70).length
    },
    foreclosure_risk: {
      mean: avg(predictions.map(p => p.foreclosure_risk)),
      high_risk_count: predictions.filter(p => p.foreclosure_risk > 70).length
    },
    total_population: predictions.reduce((sum, p) => sum + p.population, 0)
  }
}

/**
 * Find neighboring block groups (same first 9 digits of GEOID)
 */
export function findNeighbors(
  geoid: string,
  allBlockGroups: BlockGroupData[],
  limit: number = 4
): BlockGroupData[] {
  return allBlockGroups
    .filter(bg => bg.geoid !== geoid && bg.geoid.substring(0, 9) === geoid.substring(0, 9))
    .slice(0, limit)
}
