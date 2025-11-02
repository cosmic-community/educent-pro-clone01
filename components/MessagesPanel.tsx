'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Message {
  id: string
  title: string
  content: string
  sender: string
  timestamp: Date
  type: 'notice' | 'announcement' | 'circular'
  important: boolean
  saved?: boolean
  attachments?: string[]
}

interface MessagesPanelProps {
  messages: Message[]
}

export default function MessagesPanel({ messages = [] }: MessagesPanelProps) {
  const [savedMessages, setSavedMessages] = useState<string[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'saved' | 'important'>('all')

  // Demo messages if none provided
  const demoMessages: Message[] = messages.length > 0 ? messages : [
    {
      id: '1',
      title: 'Annual Day Celebration Notice',
      content: 'Dear students, our Annual Day celebration will be held on February 20th, 2024. All students are required to participate in cultural activities.',
      sender: 'Principal',
      timestamp: new Date('2024-02-01'),
      type: 'notice',
      important: true
    },
    {
      id: '2',
      title: 'Mid-Term Exam Schedule',
      content: 'Mid-term examinations will commence from March 1st, 2024. Detailed timetable has been uploaded to the portal.',
      sender: 'Examination Department',
      timestamp: new Date('2024-02-02'),
      type: 'circular',
      important: true
    },
    {
      id: '3',
      title: 'Library Book Return Reminder',
      content: 'Please return all borrowed library books by February 15th to avoid late fees.',
      sender: 'Librarian',
      timestamp: new Date('2024-02-03'),
      type: 'announcement',
      important: false
    }
  ]

  const handleSaveMessage = (messageId: string) => {
    setSavedMessages(prev => {
      if (prev.includes(messageId)) {
        toast.success('Message removed from saved')
        return prev.filter(id => id !== messageId)
      } else {
        toast.success('Message saved')
        return [...prev, messageId]
      }
    })
  }

  const getFilteredMessages = () => {
    let filtered = demoMessages
    if (filterType === 'saved') {
      filtered = filtered.filter(m => savedMessages.includes(m.id))
    } else if (filterType === 'important') {
      filtered = filtered.filter(m => m.important)
    }
    return filtered
  }

  const filteredMessages = getFilteredMessages()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Messages & Notices</h2>
          <div className="flex space-x-2">
            {(['all', 'saved', 'important'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filterType === filter
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                  message.important ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {message.important && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Important
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        message.type === 'notice' 
                          ? 'bg-blue-100 text-blue-700'
                          : message.type === 'announcement'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{message.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{message.content}</p>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <span>From: {message.sender}</span>
                      <span>{message.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSaveMessage(message.id)
                    }}
                    className={`ml-4 p-2 rounded-lg transition-colors ${
                      savedMessages.includes(message.id)
                        ? 'text-yellow-600 bg-yellow-50'
                        : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredMessages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No {filterType === 'all' ? '' : filterType} messages</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedMessage.title}</h3>
                    <div className="flex items-center space-x-3 mt-2 text-sm text-gray-600">
                      <span>From: {selectedMessage.sender}</span>
                      <span>•</span>
                      <span>{selectedMessage.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveMessage(selectedMessage.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      savedMessages.includes(selectedMessage.id)
                        ? 'text-yellow-600 bg-yellow-50'
                        : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </button>
                </div>
                
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>

                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-primary-600 hover:underline"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          <span>Attachment {index + 1}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}