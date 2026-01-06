'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Message = {
  role: 'user' | 'bot'
  text: string
}

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // 🔹 Load suggested messages on first load
  useEffect(() => {
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get('/api/suggest-message')
      if (res.data.success) {
        setSuggestions(res.data.reply.split('||'))
      }
    } catch (err) {
      console.error('Failed to fetch suggestions')
    }
  }

  const sendMessage = async (messageText?: string) => {
    const text = messageText ?? input
    if (!text.trim() || loading) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setLoading(true)
    setInput('')

    try {
      const res = await axios.post('/api/chat', { message: text })

      setMessages(prev => [
        ...prev,
        { role: 'bot', text: res.data.reply }
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Something went wrong 😢' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Suggested Messages */}
      {messages.length === 0 && suggestions.length > 0 && (
        <div className="p-4 flex gap-2 flex-wrap bg-white border-b">
          {suggestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              className="px-3 py-1 text-sm rounded-full bg-gray-200 hover:bg-gray-300 transition"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xl p-3 rounded-lg ${
              m.role === 'user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'mr-auto bg-white border'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <p className="text-gray-400 text-sm">Bro is typing...</p>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me bro..."
          disabled={loading}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={() => sendMessage()} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  )
}
