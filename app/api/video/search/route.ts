import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { topic, language } = await request.json()

    // In production, this would use YouTube Data API
    // For demo, return a placeholder video URL
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
  // This would be replaced with actual YouTube API call
  // For demo purposes, we'll return a placeholder
  
  // In production:
  // 1. Use YouTube Data API v3
  // 2. Search for educational videos with topic + language
  // 3. Filter by education category
  // 4. Return the most relevant video
  
  // Placeholder educational video IDs (replace with actual search)
  const educationalVideos: Record<string, string> = {
    'Quadratic Equations': 'i7idZfS8t8w',
    'Photosynthesis': 'CMiPYhFDJ6A',
    'World War II': 'HUqy-OQvVtI',
    'Python Programming': '_uQrJ0TkZlc',
    default: 'dQw4w9WgXcQ'
  }

  const videoId = educationalVideos[topic] || educationalVideos.default
  return `https://www.youtube.com/embed/${videoId}`
}