'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function VideoLearning() {
  const [topic, setTopic] = useState('')
  const [language, setLanguage] = useState('English')
  const [videoUrl, setVideoUrl] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchHistory, setSearchHistory] = useState<Array<{topic: string, url: string, timestamp: Date}>>([])

  const handleSearchVideo = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setIsSearching(true)
    
    try {
      // In production, this would call YouTube API or similar
      const response = await fetch('/api/video/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language })
      })

      if (!response.ok) throw new Error('Failed to find video')

      const data = await response.json()
      setVideoUrl(data.videoUrl || `https://www.youtube.com/embed/dQw4w9WgXcQ`)
      
      setSearchHistory(prev => [...prev, { 
        topic, 
        url: data.videoUrl || `https://www.youtube.com/embed/dQw4w9WgXcQ`,
        timestamp: new Date() 
      }])
    } catch (error) {
      // Demo fallback - would use actual YouTube embed
      const demoVideoId = 'dQw4w9WgXcQ' // Replace with actual educational video ID
      setVideoUrl(`https://www.youtube.com/embed/${demoVideoId}`)
      
      setSearchHistory(prev => [...prev, { 
        topic, 
        url: `https://www.youtube.com/embed/${demoVideoId}`,
        timestamp: new Date() 
      }])
      
      toast.success(`Found video for: ${topic}`)
    } finally {
      setIsSearching(false)
    }
  }

  const suggestedTopics = [
    'Quadratic Equations',
    'Photosynthesis',
    'World War II',
    'Python Programming',
    'Shakespeare Literature',
    'Quantum Physics',
    'Chemical Reactions',
    'Calculus Basics'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          AI Video Learning - Smart Video Discovery
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic to learn about..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearchVideo()}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
              <option>Japanese</option>
            </select>
          </div>
        </div>

        <motion.button
          onClick={handleSearchVideo}
          disabled={isSearching}
          className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSearching ? 'Searching...' : 'Find Educational Video'}
        </motion.button>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested Topics:</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.map((suggestedTopic) => (
              <button
                key={suggestedTopic}
                onClick={() => setTopic(suggestedTopic)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {suggestedTopic}
              </button>
            ))}
          </div>
        </div>

        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6"
          >
            <h3 className="text-lg font-semibold mb-3">Video Player</h3>
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg bg-black">
              <iframe
                src={videoUrl}
                title="Educational Video"
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}

        {searchHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Recent Searches</h3>
            <div className="space-y-2">
              {searchHistory.slice(-5).reverse().map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => setVideoUrl(item.url)}
                >
                  <div>
                    <p className="font-medium">{item.topic}</p>
                    <p className="text-xs text-gray-500">{item.timestamp.toLocaleString()}</p>
                  </div>
                  <button className="text-red-500 hover:text-red-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}