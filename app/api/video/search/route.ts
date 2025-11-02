import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { topic, language } = await request.json()
    
    // If YouTube API key is available, use real search
    if (process.env.YOUTUBE_API_KEY) {
      const searchQuery = encodeURIComponent(`${topic} tutorial education ${language}`)
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&videoCategoryId=27&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.items && data.items.length > 0) {
          const videoId = data.items[0].id.videoId
          return NextResponse.json({ 
            videoUrl: `https://www.youtube.com/embed/${videoId}` 
          })
        }
      }
    }
    
    // Fallback to curated educational videos
    const videoUrl = await searchEducationalVideo(topic, language)
    return NextResponse.json({ videoUrl })
  } catch (error) {
    console.error('Video search error:', error)
    return NextResponse.json(
      { error: 'Failed to search video' },
      { status: 500 }
    )
  }
}

async function searchEducationalVideo(topic: string, language: string): Promise<string> {
  // Curated educational video IDs by topic
  const educationalVideos: Record<string, string> = {
    // Mathematics
    'Quadratic Equations': 'i7idZfS8t8w',
    'Linear Algebra': 'fNk_zzaMoSs',
    'Calculus': 'WUvTyaaNkzM',
    'Geometry': 'GNcFjFmqEc',
    'Trigonometry': 'PUB0TaZ7h8Y',
    
    // Science
    'Photosynthesis': 'CMiPYhFDJ6A',
    'Newton Laws': 'kKKM8Y-u7ds',
    'Chemical Reactions': 'zTXLU-uZeyw',
    'Electricity': 'mc979OhitAg',
    'Evolution': 'hOfRN0KihOU',
    
    // Computer Science
    'Python Programming': '_uQrJ0TkZlc',
    'JavaScript': 'W6NZfCO5SIk',
    'Data Structures': '8hly31xKli0',
    'Machine Learning': 'Gv9_4yMHFhI',
    'Web Development': 'ysEN5RaKOlA',
    
    // History
    'World War II': 'HUqy-OQvVtI',
    'Ancient Rome': 'wgbYOujdvOg',
    'Renaissance': '7n8L94sKQF8',
    'Industrial Revolution': 'xPxFw_b2MRo',
    
    // Default fallback
    default: 'dQw4w9WgXcQ'
  }
  
  // Find best matching video
  const matchedKey = Object.keys(educationalVideos).find(key => 
    topic.toLowerCase().includes(key.toLowerCase())
  )
  
  // Fixed: Check if matchedKey exists before using it as index
  const videoId = matchedKey ? educationalVideos[matchedKey] : (educationalVideos[topic] ?? educationalVideos.default)
  
  return `https://www.youtube.com/embed/${videoId}`
}