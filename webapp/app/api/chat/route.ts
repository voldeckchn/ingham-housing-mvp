import { StreamingTextResponse } from 'ai'
import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

// Helper to convert AI SDK messages to Anthropic format
function toAnthropicMessages(messages: any[]): Anthropic.MessageParam[] {
  return messages.map((msg: any) => ({
    role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
    content: msg.content
  }))
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const response = await anthropic.messages.stream({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 1024,
    system: `You are a housing equity data assistant for Ingham County, Michigan.

You help users understand housing equity, gentrification risk, and foreclosure risk across Census Block Groups.

When users ask about areas, always include the 12-digit GEOID numbers in your response so they can be highlighted on the map.

For example:
- "Block Group 260650001001 has an equity score of 45.2"
- "The top 5 areas by foreclosure risk are: 260650001002, 260650001003..."

Important context:
- Equity Score (0-100): Higher = better housing equity
- Gentrification Risk (0-100): Higher = more at risk of displacement
- Foreclosure Risk (0-100): Higher = more at risk

You can answer questions about specific areas, compare areas, find top/bottom performers, and explain what drives the scores.

Stay focused on the housing equity data. Do not discuss unrelated topics.`,
    messages: toAnthropicMessages(messages),
  })

  // Convert Anthropic stream to text stream
  const stream = new ReadableStream({
    async start(controller) {
      for await (const event of response) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          const text = event.delta.text
          controller.enqueue(new TextEncoder().encode(text))
        }
      }
      controller.close()
    },
  })

  return new StreamingTextResponse(stream)
}
