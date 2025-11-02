'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Reward, SyllabusItem, Query, Notification, User, Attendance } from '@/types'
import type { Assignment as CosmicAssignment, Message as CosmicMessage } from '@/types'
import Sidebar from '@/components/Sidebar'
import KPICards from '@/components/KPICards'
import RewardTracker from '@/components/RewardTracker'
import SyllabusTracker from '@/components/SyllabusTracker'
import NotificationBell from '@/components/NotificationBell'
import AIStudyBuddy from '@/components/AIStudyBuddy'
import VideoLearning from '@/components/VideoLearning'
import AssignmentsPanel from '@/components/AssignmentsPanel'
import RewardsPanel from '@/components/RewardsPanel'
import MessagesPanel from '@/components/MessagesPanel'
import Background3D from '@/components/3DBackground'
import { calculateAttendanceStreak } from '@/lib/attendance'

interface StudentDashboardProps {
  rewards: Reward[]
  syllabusItems: SyllabusItem[]
  queries: Query[]
  notifications: Notification[]
  user: User
  assignments: CosmicAssignment[]
  messages: CosmicMessage[]
  attendance: Attendance[]
}

// Local interface for AssignmentsPanel
interface LocalAssignment {
  id: string
  title: string
  subject: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded'
  grade?: string
  description: string
  attachments?: string[]
  lecturer: string
}

// Local interface for MessagesPanel
interface LocalMessage {
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

export default function StudentDashboard({ 
  rewards, 
  syllabusItems, 
  queries, 
  notifications,
  user,
  assignments,
  messages,
  attendance
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [attendanceStreak, setAttendanceStreak] = useState(0)
  
  useEffect(() => {
    // Calculate attendance streak
    const streak = calculateAttendanceStreak(attendance, user.id)
    setAttendanceStreak(streak)
  }, [attendance, user])
  
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'study-buddy', label: 'AI Study Buddy', icon: '🤖' },
    { id: 'video-learning', label: 'Video Learning', icon: '🎥' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'syllabus', label: 'Syllabus', icon: '📚' },
    { id: 'rewards', label: 'Rewards', icon: '🏆' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]
  
  const completedTopics = syllabusItems.filter(item => item.metadata?.completed_by_lecturer).length
  const totalTopics = syllabusItems.length
  const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0
  
  const kpiData = [
    { 
      label: 'Attendance Streak', 
      value: `${attendanceStreak} Days`, 
      icon: '🔥',
      color: 'bg-orange-500'
    },
    { 
      label: 'Overall Grade', 
      value: 'A+', 
      icon: '📈',
      color: 'bg-green-500'
    },
    { 
      label: 'AI Questions', 
      value: queries.length.toString(), 
      icon: '🤔',
      color: 'bg-primary-500'
    },
    { 
      label: 'Syllabus Progress', 
      value: `${Math.round(progressPercentage)}%`, 
      icon: '📊',
      color: 'bg-secondary-500'
    }
  ]
  
  // Transform Cosmic assignments to local format
  const localAssignments: LocalAssignment[] = assignments.map(a => ({
    id: a.id,
    title: a.metadata?.title ?? a.title,
    subject: a.metadata?.subject ?? 'Unknown Subject',
    dueDate: a.metadata?.due_date ?? new Date().toISOString(),
    status: 'pending' as const,
    description: a.metadata?.description ?? '',
    lecturer: a.metadata?.lecturer_id ?? 'Unknown Lecturer'
  }))
  
  // Transform Cosmic messages to local format
  const localMessages: LocalMessage[] = messages.map(m => ({
    id: m.id,
    title: m.metadata?.title ?? m.title,
    content: m.metadata?.content ?? '',
    sender: m.metadata?.sender_id ?? 'Unknown Sender',
    timestamp: new Date(m.created_at),
    type: (m.metadata?.type?.key ?? 'notice') as 'notice' | 'announcement' | 'circular',
    important: m.metadata?.important ?? false
  }))
  
  return (
    <>
      <Background3D />
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex">
          <Sidebar 
            items={sidebarItems} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            role="student"
          />
          
          <div className="flex-1">
            <motion.header 
              className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.metadata?.display_name}!
                </h1>
                <div className="flex items-center space-x-4">
                  <input
                    type="search"
                    placeholder="Search..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <NotificationBell notifications={notifications} />
                  <div className="flex items-center space-x-2">
                    {user.metadata?.profile_image ? (
                      <img 
                        src={`${user.metadata.profile_image.imgix_url}?w=64&h=64&fit=crop&auto=format,compress`}
                        alt={user.metadata.display_name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.metadata?.display_name?.charAt(0) || 'S'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.header>
            
            <main className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <KPICards data={kpiData} />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <motion.div 
                        className="bg-white/90 backdrop-blur rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform"
                        whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      >
                        <h2 className="text-lg font-semibold mb-4">AI Study Buddy Quick Access</h2>
                        <div className="space-y-4">
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option>Mathematics</option>
                            <option>Science</option>
                            <option>English</option>
                            <option>History</option>
                          </select>
                          <button 
                            onClick={() => setActiveTab('study-buddy')}
                            className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105"
                          >
                            Ask AI Teacher
                          </button>
                        </div>
                      </motion.div>
                      
                      <RewardTracker rewards={rewards} attendanceStreak={attendanceStreak} />
                    </div>
                    
                    <SyllabusTracker items={syllabusItems} />
                    
                    <motion.div 
                      className="bg-white/90 backdrop-blur rounded-lg shadow-md p-6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h2 className="text-lg font-semibold mb-4">Raise a Query</h2>
                      <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <select className="px-4 py-2 border border-gray-300 rounded-lg">
                            <option>Select Subject</option>
                            <option>Mathematics</option>
                            <option>Science</option>
                            <option>English</option>
                          </select>
                          <select className="px-4 py-2 border border-gray-300 rounded-lg">
                            <option>Select Lecturer</option>
                            <option>Prof. Michael Chen</option>
                            <option>Dr. Sarah Johnson</option>
                          </select>
                        </div>
                        <textarea
                          placeholder="Type your query here..."
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                        />
                        <button
                          type="submit"
                          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors transform hover:scale-105"
                        >
                          Submit Query
                        </button>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
                
                {activeTab === 'study-buddy' && (
                  <AIStudyBuddy />
                )}
                
                {activeTab === 'video-learning' && (
                  <VideoLearning />
                )}
                
                {activeTab === 'assignments' && (
                  <AssignmentsPanel assignments={localAssignments} />
                )}
                
                {activeTab === 'rewards' && (
                  <RewardsPanel rewards={rewards} attendanceStreak={attendanceStreak} />
                )}
                
                {activeTab === 'messages' && (
                  <MessagesPanel messages={localMessages} />
                )}
                
                {activeTab === 'syllabus' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <SyllabusTracker items={syllabusItems} detailed={true} />
                  </motion.div>
                )}
                
                {!['dashboard', 'study-buddy', 'video-learning', 'assignments', 'rewards', 'messages', 'syllabus'].includes(activeTab) && (
                  <motion.div 
                    className="bg-white/90 backdrop-blur rounded-lg shadow-md p-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <h2 className="text-2xl font-semibold mb-4 capitalize">{activeTab.replace('-', ' ')}</h2>
                    <p className="text-gray-600">This section is under development.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </motion.div>
    </>
  )
}