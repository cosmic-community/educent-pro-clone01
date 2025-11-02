'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function AIStudyBuddy() {
  const [subject, setSubject] = useState('Mathematics')
  const [question, setQuestion] = useState('')
  const [conversation, setConversation] = useState<Array<{role: string, content: string, timestamp: Date}>>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question')
      return
    }

    const userMessage = { role: 'user', content: question, timestamp: new Date() }
    setConversation(prev => [...prev, userMessage])
    setQuestion('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/study-buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, question })
      })

      if (!response.ok) throw new Error('Failed to get AI response')

      const data = await response.json()
      const aiMessage = { 
        role: 'assistant', 
        content: data.response || "Let me explain this concept to you...", 
        timestamp: new Date() 
      }
      
      setConversation(prev => [...prev, aiMessage])
    } catch (error) {
      // Fallback response for demo
      const demoResponse = {
        role: 'assistant',
        content: `Great question about ${subject}! Let me explain this concept step by step:\n\n1. First, let's understand the fundamentals...\n2. Now, applying this to your specific question...\n3. Here's a practical example...\n\nWould you like me to elaborate on any particular part?`,
        timestamp: new Date()
      }
      setConversation(prev => [...prev, demoResponse])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          AI Study Buddy - Your Personal Teacher
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
            <option>History</option>
            <option>Computer Science</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Biology</option>
          </select>
        </div>

        <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4">
          <AnimatePresence>
            {conversation.length === 0 ? (
              <motion.div 
                className="flex items-center justify-center h-full text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🤖</span>
                  <p>Hello! I'm your AI teacher. Ask me anything about {subject}!</p>
                  <p className="text-sm mt-2">I can explain concepts, solve problems, and help you understand better.</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {conversation.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <span className={`text-xs ${msg.role === 'user' ? 'text-primary-100' : 'text-gray-500'} mt-1 block`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
            placeholder="Ask your question here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
          <motion.button
            onClick={handleAskQuestion}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ask AI
          </motion.button>
        </div>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
          {['Explain this concept', 'Give me an example', 'How do I solve this?', 'Why is this important?'].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setQuestion(prompt)}
              className="text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}