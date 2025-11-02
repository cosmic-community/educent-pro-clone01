'use client'

import { motion } from 'framer-motion'
import type { Reward } from '@/types'

interface RewardTrackerProps {
  rewards: Reward[]
  attendanceStreak?: number // Added optional attendanceStreak prop
}

export default function RewardTracker({ rewards, attendanceStreak }: RewardTrackerProps) {
  const latestReward = rewards[0]
  
  const steps = [
    { key: 'pending', label: 'System', icon: '💻', status: 'complete' },
    { key: 'lecturer_verified', label: 'Lecturer', icon: '👨‍🏫', status: 'active' },
    { key: 'principal_recommended', label: 'Principal', icon: '🏫', status: 'pending' },
    { key: 'admin_approved', label: 'Admin', icon: '✅', status: 'pending' }
  ]

  const currentStatus = latestReward?.metadata?.status?.key || 'pending'
  
  const getStepStatus = (stepKey: string) => {
    const stepIndex = steps.findIndex(s => s.key === stepKey)
    const currentIndex = steps.findIndex(s => s.key === currentStatus)
    
    if (stepIndex < currentIndex) return 'complete'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Reward Status Tracker</h2>
        {attendanceStreak !== undefined && (
          <span className="text-sm text-gray-600">
            🔥 {attendanceStreak} day streak
          </span>
        )}
      </div>
      {latestReward ? (
        <div>
          <p className="text-sm text-gray-600 mb-4">{latestReward.title}</p>
          <div className="relative">
            <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200" />
            <div className="flex justify-between relative">
              {steps.map((step, index) => {
                const status = getStepStatus(step.key)
                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 ${
                        status === 'complete' ? 'bg-green-500 text-white' :
                        status === 'active' ? 'bg-primary-500 text-white animate-pulse' :
                        'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span className="text-xs mt-2 text-gray-600">{step.label}</span>
                    {status === 'active' && (
                      <span className="text-xs text-primary-600 font-semibold">Current</span>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No active rewards</p>
      )}
    </div>
  )
}