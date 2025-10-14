import { streamText, tool } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import predictions from '@/public/data/bg_predictions.json'

// Define AI tools for housing equity queries
const tools = {
  getBlockGroupData: tool({
    description: 'Get detailed data for a specific block group by GEOID',
    inputSchema: z.object({
      geoid: z.string().describe('The Census block group GEOID (e.g., 260650001001)')
    }),
    execute: async ({ geoid }) => {
      const bg = predictions.find((p: any) => p.geoid === geoid)
      if (!bg) return { error: 'Block group not found' }
      return bg
    }
  }),

  compareBlockGroups: tool({
    description: 'Compare metrics between two block groups',
    inputSchema: z.object({
      geoid1: z.string(),
      geoid2: z.string()
    }),
    execute: async ({ geoid1, geoid2 }) => {
      const bg1 = predictions.find((p: any) => p.geoid === geoid1)
      const bg2 = predictions.find((p: any) => p.geoid === geoid2)

      if (!bg1 || !bg2) return { error: 'One or both block groups not found' }

      return {
        comparison: {
          equity_score_diff: bg1.equity_score - bg2.equity_score,
          gentrification_risk_diff: bg1.gentrification_risk - bg2.gentrification_risk,
          foreclosure_risk_diff: bg1.foreclosure_risk - bg2.foreclosure_risk,
          income_diff: bg1.median_income - bg2.median_income,
        },
        bg1,
        bg2
      }
    }
  }),

  findTopAreas: tool({
    description: 'Find top N block groups by a specific metric',
    inputSchema: z.object({
      metric: z.enum(['equity_score', 'gentrification_risk', 'foreclosure_risk', 'median_income']),
      limit: z.number().default(5),
      order: z.enum(['highest', 'lowest']).default('highest')
    }),
    execute: async ({ metric, limit, order }) => {
      const sorted = [...predictions].sort((a: any, b: any) =>
        order === 'highest' ? b[metric] - a[metric] : a[metric] - b[metric]
      )
      return sorted.slice(0, limit)
    }
  }),

  simulateIntervention: tool({
    description: 'Simulate impact of changing a variable (income, price, etc.) on scores',
    inputSchema: z.object({
      geoid: z.string(),
      variable: z.enum(['median_income', 'median_price']),
      percentChange: z.number().describe('Percentage change (e.g., 10 for +10%)')
    }),
    execute: async ({ geoid, variable, percentChange }) => {
      const bg: any = predictions.find((p: any) => p.geoid === geoid)
      if (!bg) return { error: 'Block group not found' }

      // Simple simulation logic
      const factor = 1 + (percentChange / 100)
      const newValue = bg[variable] * factor

      // Rough estimate of score impact
      let equityScoreChange = 0
      let foreclosureRiskChange = 0

      if (variable === 'median_income') {
        equityScoreChange = percentChange * 0.3
        foreclosureRiskChange = -percentChange * 0.2
      } else if (variable === 'median_price') {
        equityScoreChange = -percentChange * 0.1
        foreclosureRiskChange = percentChange * 0.15
      }

      return {
        original: bg,
        simulation: {
          [variable]: newValue,
          equity_score: Math.max(0, Math.min(100, bg.equity_score + equityScoreChange)),
          foreclosure_risk: Math.max(0, Math.min(100, bg.foreclosure_risk + foreclosureRiskChange)),
          gentrification_risk: bg.gentrification_risk
        },
        changes: {
          equity_score_change: equityScoreChange,
          foreclosure_risk_change: foreclosureRiskChange
        }
      }
    }
  }),

  getAreaStatistics: tool({
    description: 'Get statistical summary of all block groups',
    inputSchema: z.object({}),
    execute: async () => {
      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length

      return {
        count: predictions.length,
        equity_score: {
          mean: avg(predictions.map((p: any) => p.equity_score)),
          min: Math.min(...predictions.map((p: any) => p.equity_score)),
          max: Math.max(...predictions.map((p: any) => p.equity_score))
        },
        gentrification_risk: {
          mean: avg(predictions.map((p: any) => p.gentrification_risk)),
          high_risk_count: predictions.filter((p: any) => p.gentrification_risk > 70).length
        },
        foreclosure_risk: {
          mean: avg(predictions.map((p: any) => p.foreclosure_risk)),
          high_risk_count: predictions.filter((p: any) => p.foreclosure_risk > 70).length
        }
      }
    }
  })
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic('claude-3-5-haiku-20241022'),
    system: `You are a housing equity data assistant for Ingham County, Michigan.

You help users understand housing equity, gentrification risk, and foreclosure risk across Census Block Groups.

Your capabilities:
- Query specific block group data
- Compare areas
- Explain what drives scores
- Simulate "what-if" scenarios (e.g., "what if income increases 10%?")
- Find top/bottom performing areas

Important context:
- Equity Score (0-100): Higher = better housing equity
- Gentrification Risk (0-100): Higher = more at risk of displacement
- Foreclosure Risk (0-100): Higher = more at risk

Stay focused on the housing equity data. Do not discuss unrelated topics.`,
    messages,
    tools,
  })

  return result.toUIMessageStreamResponse()
}
