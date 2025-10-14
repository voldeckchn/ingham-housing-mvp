'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from '@ai-sdk/react'
import { useState, useEffect } from 'react'

interface AIAssistantProps {
  onHighlightAreas?: (geoids: string[]) => void
  onFocusArea?: (geoid: string) => void
}

export default function AIAssistant({ onHighlightAreas, onFocusArea }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  // Extract GEOIDs from AI responses for map highlighting
  useEffect(() => {
    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'user') {
      // Extract text from parts
      const messageText = lastMessage.parts
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join(' ')

      // Try to extract GEOIDs from the message content
      const geoidPattern = /\b\d{12}\b/g
      const geoids = messageText.match(geoidPattern) || []

      if (geoids.length > 0 && onHighlightAreas) {
        onHighlightAreas(geoids)
      }
    }
  }, [messages, onHighlightAreas])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && status === 'ready') {
      sendMessage({ text: input })
      setInput('')
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center z-50 transition-all"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
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
                <p className="mb-2">Try asking:</p>
                <ul className="list-disc ml-4 space-y-1 text-xs">
                  <li>"What are the top 5 areas by equity score?"</li>
                  <li>"Which areas have the highest foreclosure risk?"</li>
                  <li>"What if income increased by 15%?"</li>
                  <li>"Show me high gentrification risk areas"</li>
                </ul>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {msg.parts
                      .filter((part: any) => part.type === 'text')
                      .map((part: any, i: number) => (
                        <span key={i}>{part.text}</span>
                      ))}
                  </div>
                </div>
              </div>
            ))}

            {status === 'streaming' && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-delay-200"></div>
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
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the data..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={status !== 'ready'}
              />
              <button
                type="submit"
                disabled={status !== 'ready' || !input.trim()}
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
