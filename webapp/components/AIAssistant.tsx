'use client'

import { useChat } from 'ai/react'
import { useState, useEffect } from 'react'
import TrendChart from './TrendChart'

interface AIAssistantProps {
  onHighlightAreas?: (geoids: string[]) => void
  onSpilloverAreas?: (geoids: string[]) => void
  onFocusArea?: (geoid: string) => void
}

interface TimelineData {
  month: number
  equity_score: number
  gentrification_risk: number
  foreclosure_risk: number
}

export default function AIAssistant({ onHighlightAreas, onSpilloverAreas, onFocusArea }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chartData, setChartData] = useState<TimelineData[] | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })

  // Extract GEOIDs, timeline data, and spillover areas from AI responses
  useEffect(() => {
    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'user') {
      const messageText = lastMessage.content || ''

      // Try to extract GEOIDs from the message content
      const geoidPattern = /\b\d{12}\b/g
      const geoids = messageText.match(geoidPattern) || []

      if (geoids.length > 0 && onHighlightAreas) {
        onHighlightAreas(geoids)
      }

      // Try to extract timeline data and spillover info from message (if it's a JSON block)
      try {
        const jsonMatch = messageText.match(/```json\n([\s\S]*?)\n```/)
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[1])

          // Timeline data for charts
          if (data.timeline && Array.isArray(data.timeline)) {
            setChartData(data.timeline)
          }

          // Spillover areas (from spillover simulations)
          if (data.spillover && Array.isArray(data.spillover) && onSpilloverAreas) {
            const spilloverGeoids = data.spillover.map((s: any) => s.geoid).filter(Boolean)
            onSpilloverAreas(spilloverGeoids)
          }
        }
      } catch (e) {
        // Not JSON, that's fine
      }
    }
  }, [messages, onHighlightAreas, onSpilloverAreas])

  return (
    <>
      {/* Floating button - Highly visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 hover:scale-110 flex items-center justify-center z-50 transition-all animate-pulse"
        aria-label="Toggle AI Assistant"
        title="Chat with AI Assistant"
      >
        <span className="text-2xl">{isOpen ? '✕' : '💬'}</span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="p-4 border-b bg-blue-600 text-white rounded-t-lg">
            <h3 className="font-bold">Housing Equity Assistant</h3>
            <p className="text-xs text-blue-100">Ask about the data or run simulations</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-sm text-gray-500">
                <p className="mb-2 font-semibold">Try asking:</p>
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">📊 Data Queries:</p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>"What are the top 5 areas by equity score?"</li>
                      <li>"Which areas have the highest foreclosure risk?"</li>
                      <li>"Show me overall statistics"</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">🔄 Causal Loop Simulations:</p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>"Simulate $2M HTF investment over 12 months"</li>
                      <li>"What if we do nothing in high-risk areas?"</li>
                      <li>"Show spillover effects of $500K investment"</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={msg.id}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>

                {/* Show chart if this is the last assistant message and we have timeline data */}
                {msg.role === 'assistant' && idx === messages.length - 1 && chartData && (
                  <div className="mt-3">
                    <TrendChart timeline={chartData} height={250} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about the data..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
