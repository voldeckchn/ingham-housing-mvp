import { StreamingTextResponse } from 'ai'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { BlockGroupData } from '@/lib/types'
import {
  simulateCausalLoop,
  simulateSpilloverEffects,
  findTopAreas,
  compareBlockGroups,
  getAreaStatistics,
  findNeighbors
} from '@/lib/ai-tools'

export const runtime = 'nodejs'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// Load predictions data (in production, use a database)
let predictionsCache: BlockGroupData[] | null = null

async function loadPredictions(): Promise<BlockGroupData[]> {
  if (predictionsCache) return predictionsCache

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/data/bg_predictions.json`)
  const data: BlockGroupData[] = await response.json()
  predictionsCache = data
  return data
}

// Define tools for Claude
const tools: Anthropic.Tool[] = [
  {
    name: 'getBlockGroupData',
    description: 'Get detailed data for a specific block group by GEOID',
    input_schema: {
      type: 'object',
      properties: {
        geoid: {
          type: 'string',
          description: 'The Census block group GEOID (12-digit number, e.g., 260650001001)'
        }
      },
      required: ['geoid']
    }
  },
  {
    name: 'findTopAreas',
    description: 'Find top N block groups by a specific metric (equity_score, gentrification_risk, foreclosure_risk, median_income)',
    input_schema: {
      type: 'object',
      properties: {
        metric: {
          type: 'string',
          enum: ['equity_score', 'gentrification_risk', 'foreclosure_risk', 'median_income'],
          description: 'The metric to sort by'
        },
        limit: {
          type: 'number',
          description: 'Number of results to return',
          default: 5
        },
        order: {
          type: 'string',
          enum: ['highest', 'lowest'],
          description: 'Sort order',
          default: 'highest'
        }
      },
      required: ['metric']
    }
  },
  {
    name: 'compareBlockGroups',
    description: 'Compare metrics between two block groups',
    input_schema: {
      type: 'object',
      properties: {
        geoid1: {
          type: 'string',
          description: 'First block group GEOID'
        },
        geoid2: {
          type: 'string',
          description: 'Second block group GEOID'
        }
      },
      required: ['geoid1', 'geoid2']
    }
  },
  {
    name: 'simulateCausalLoop',
    description: 'Simulate causal loop dynamics over time with feedback effects (PDF pages 24-27). Shows how interventions affect equity, gentrification, and foreclosure risk over 12 months with feedback loops.',
    input_schema: {
      type: 'object',
      properties: {
        geoid: {
          type: 'string',
          description: 'Block group GEOID to simulate'
        },
        intervention_type: {
          type: 'string',
          enum: ['htf_investment', 'income_support', 'rent_control'],
          description: 'Type of intervention'
        },
        intervention_amount: {
          type: 'number',
          description: 'Dollar amount for HTF investment or percentage for income_support/rent_control'
        },
        duration_months: {
          type: 'number',
          description: 'Simulation period in months',
          default: 12
        }
      },
      required: ['geoid', 'intervention_type', 'intervention_amount']
    }
  },
  {
    name: 'simulateSpilloverEffects',
    description: 'Simulate how intervention in one area affects adjacent block groups (PDF page 25)',
    input_schema: {
      type: 'object',
      properties: {
        geoid: {
          type: 'string',
          description: 'Block group GEOID'
        },
        intervention_type: {
          type: 'string',
          enum: ['htf_investment', 'income_support'],
          description: 'Type of intervention'
        },
        intervention_amount: {
          type: 'number',
          description: 'Dollar amount or percentage'
        }
      },
      required: ['geoid', 'intervention_type', 'intervention_amount']
    }
  },
  {
    name: 'getAreaStatistics',
    description: 'Get statistical summary of all block groups (count, averages, high-risk areas)',
    input_schema: {
      type: 'object',
      properties: {},
      required: []
    }
  }
]

// Execute tool
async function executeTool(toolName: string, toolInput: any): Promise<any> {
  const predictions = await loadPredictions()

  switch (toolName) {
    case 'getBlockGroupData': {
      const bg = predictions.find(p => p.geoid === toolInput.geoid)
      return bg || { error: 'Block group not found' }
    }

    case 'findTopAreas': {
      return findTopAreas(
        predictions,
        toolInput.metric as keyof BlockGroupData,
        toolInput.limit || 5,
        toolInput.order || 'highest'
      )
    }

    case 'compareBlockGroups': {
      const bg1 = predictions.find(p => p.geoid === toolInput.geoid1)
      const bg2 = predictions.find(p => p.geoid === toolInput.geoid2)
      if (!bg1 || !bg2) return { error: 'One or both block groups not found' }
      return compareBlockGroups(bg1, bg2)
    }

    case 'simulateCausalLoop': {
      const bg = predictions.find(p => p.geoid === toolInput.geoid)
      if (!bg) return { error: 'Block group not found' }

      return simulateCausalLoop(bg, {
        type: toolInput.intervention_type,
        amount: toolInput.intervention_amount,
        duration: toolInput.duration_months || 12
      })
    }

    case 'simulateSpilloverEffects': {
      const bg = predictions.find(p => p.geoid === toolInput.geoid)
      if (!bg) return { error: 'Block group not found' }

      const neighbors = findNeighbors(toolInput.geoid, predictions)
      return simulateSpilloverEffects(bg, neighbors, {
        type: toolInput.intervention_type,
        amount: toolInput.intervention_amount,
        duration: 12
      })
    }

    case 'getAreaStatistics': {
      return getAreaStatistics(predictions)
    }

    default:
      return { error: 'Unknown tool' }
  }
}

// Helper to convert AI SDK messages to Anthropic format
function toAnthropicMessages(messages: any[]): Anthropic.MessageParam[] {
  return messages.map((msg: any) => ({
    role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
    content: msg.content
  }))
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const systemPrompt = `You are a housing equity data assistant for Ingham County, Michigan.

You help users understand housing equity, gentrification risk, and foreclosure risk across Census Block Groups.

Your capabilities:
- Query specific block group data
- Compare areas
- Find top/bottom performing areas
- Run causal loop simulations showing feedback effects over time
- Simulate spillover effects to neighboring areas
- Explain what drives scores

When users ask about areas, ALWAYS include the 12-digit GEOID numbers in your response so they can be highlighted on the map.

For example:
- "Block Group 260650001001 has an equity score of 45.2"
- "The top 5 areas by foreclosure risk are: 260650001002, 260650001003..."

Important context:
- Equity Score (0-100): Higher = better housing equity
- Gentrification Risk (0-100): Higher = more at risk of displacement
- Foreclosure Risk (0-100): Higher = more at risk

Causal Loop Simulations:
When simulating interventions, explain the 3 core feedback loops:
1. Gentrification Spiral (Reinforcing) - Gent Risk → Displacement → Price ↑ → More Gent Risk
2. Foreclosure-Price Cycle (Balancing) - Foreclosures → Price ↓ → Less Gent Risk
3. Equity Investment Cycle (Mixed) - High Equity → Investment → More Resources + Gent Pressure

IMPORTANT: When you receive data from tools, include it in your response as a JSON code block for visualization:
- For simulateCausalLoop: \`\`\`json\n{"timeline": [timeline data array]}\n\`\`\`
- For simulateSpilloverEffects: \`\`\`json\n{"spillover": [spillover data array]}\n\`\`\`
This allows the UI to display interactive charts and map highlights.

Stay focused on the housing equity data. Do not discuss unrelated topics.`

  // Create initial message with tools
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt,
    messages: toAnthropicMessages(messages),
    tools
  })

  // Handle tool use
  let finalResponse = response
  let conversationMessages = toAnthropicMessages(messages)

  while (finalResponse.stop_reason === 'tool_use') {
    // Execute all tool calls
    const toolResults: Anthropic.MessageParam[] = []

    for (const content of finalResponse.content) {
      if (content.type === 'tool_use') {
        const result = await executeTool(content.name, content.input)
        toolResults.push({
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: content.id,
              content: JSON.stringify(result)
            }
          ]
        })
      }
    }

    // Add assistant response and tool results to conversation
    conversationMessages.push({
      role: 'assistant',
      content: finalResponse.content
    })
    conversationMessages.push(...toolResults)

    // Get next response
    finalResponse = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: conversationMessages,
      tools
    })
  }

  // Extract text from final response
  const textContent = finalResponse.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map(c => c.text)
    .join('')

  // Return as streaming response
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(textContent))
      controller.close()
    }
  })

  return new StreamingTextResponse(stream)
}
