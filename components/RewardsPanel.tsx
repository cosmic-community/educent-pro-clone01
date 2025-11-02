'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import type { Reward } from '@/types'

interface RewardsPanelProps {
  rewards: Reward[]
  attendanceStreak: number
}

export default function RewardsPanel({ rewards, attendanceStreak }: RewardsPanelProps) {
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinResult, setSpinResult] = useState<string | null>(null)
  const [canClaim60DayReward, setCanClaim60DayReward] = useState(false)
  const [canSpinWheel, setCanSpinWheel] = useState(false)
  const [upiId, setUpiId] = useState('')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  useEffect(() => {
    // Check eligibility for rewards
    setCanClaim60DayReward(attendanceStreak >= 60)
    // For demo, we'll check if streak is 365 (full year)
    setCanSpinWheel(attendanceStreak >= 365)
  }, [attendanceStreak])

  const wheelPrizes = [
    { id: 1, name: 'iPhone 17 Pro Max', color: '#FF6B6B', probability: 0.001 },
    { id: 2, name: 'PS5', color: '#4ECDC4', probability: 0.002 },
    { id: 3, name: 'Gaming Laptop', color: '#45B7D1', probability: 0.003 },
    { id: 4, name: 'Gaming PC', color: '#96CEB4', probability: 0.004 },
    { id: 5, name: '₹1000 Cash', color: '#FFEAA7', probability: 0.99 },
    { id: 6, name: 'Lava Agni 2', color: '#DDA0DD', probability: 0.005 }
  ]

  const handleSpin = () => {
    if (!canSpinWheel && attendanceStreak < 365) {
      toast.error('You need 365 days of perfect attendance to spin the wheel!')
      return
    }

    setIsSpinning(true)
    setSpinResult(null)

    // Simulate spinning for 3 seconds
    setTimeout(() => {
      // Always give ₹1000 cash as per requirement
      setSpinResult('₹1000 Cash')
      setIsSpinning(false)
      toast.success('Congratulations! You won ₹1000 Cash!')
      setShowWithdrawModal(true)
    }, 3000)
  }

  const handleWithdraw = async () => {
    if (!upiId) {
      toast.error('Please enter your UPI ID')
      return
    }

    // Validate UPI ID format
    const upiRegex = /^[\w.-]+@[\w.-]+$/
    if (!upiRegex.test(upiId)) {
      toast.error('Please enter a valid UPI ID')
      return
    }

    try {
      // In production, this would submit the withdrawal request
      toast.success('Withdrawal request submitted for admin approval!')
      setShowWithdrawModal(false)
      setUpiId('')
    } catch (error) {
      toast.error('Failed to submit withdrawal request')
    }
  }

  const claim60DayReward = () => {
    if (attendanceStreak < 60) {
      toast.error('You need 60 days of attendance to claim this reward!')
      return
    }
    
    // Hidden reward value - always ₹500 for 60 days
    toast.success('Congratulations! You won ₹500 for 60 days perfect attendance!')
    setShowWithdrawModal(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Rewards & Achievements</h2>
        <p className="text-lg opacity-90">Your attendance streak: {attendanceStreak} days</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-bold mb-4">60-Day Attendance Reward</h3>
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-6xl">💰</span>
              <p className="mt-4 text-gray-600">
                Complete 60 days without any absence to unlock a mystery cash reward!
              </p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (attendanceStreak / 60) * 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {Math.max(0, 60 - attendanceStreak)} days remaining
                </p>
              </div>
              <button
                onClick={claim60DayReward}
                disabled={!canClaim60DayReward}
                className={`mt-4 px-6 py-3 rounded-lg font-semibold transition-all ${
                  canClaim60DayReward
                    ? 'bg-green-500 text-white hover:bg-green-600 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canClaim60DayReward ? 'Claim Reward' : 'Locked'}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-xl font-bold mb-4">Annual Perfect Attendance - Spin Wheel</h3>
          <div className="text-center">
            <span className="text-6xl">🎰</span>
            <p className="mt-4 text-gray-600">
              365 days of perfect attendance unlocks the mega prize wheel!
            </p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-pink-600 h-4 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (attendanceStreak / 365) * 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {Math.max(0, 365 - attendanceStreak)} days remaining
              </p>
            </div>
            <button
              onClick={() => setShowSpinWheel(true)}
              disabled={!canSpinWheel && attendanceStreak < 365}
              className={`mt-4 px-6 py-3 rounded-lg font-semibold transition-all ${
                canSpinWheel || attendanceStreak >= 365
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canSpinWheel || attendanceStreak >= 365 ? 'Spin the Wheel!' : 'Locked'}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Your Reward History</h3>
        <div className="space-y-3">
          {rewards.map((reward) => (
            <div key={reward.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">{reward.title}</p>
                <p className="text-sm text-gray-600">
                  {reward.metadata?.evidence?.description}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                reward.metadata?.status?.key === 'admin_approved'
                  ? 'bg-green-100 text-green-800'
                  : reward.metadata?.status?.key === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {reward.metadata?.status?.value}
              </span>
            </div>
          ))}
          {rewards.length === 0 && (
            <p className="text-center text-gray-500 py-8">No rewards yet. Keep up your attendance!</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSpinWheel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => !isSpinning && setShowSpinWheel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-center mb-6">Mega Prize Wheel</h3>
              
              <div className="relative w-64 h-64 mx-auto mb-6">
                <motion.div
                  className="w-full h-full rounded-full relative overflow-hidden shadow-2xl"
                  animate={isSpinning ? { rotate: 720 + Math.random() * 360 } : { rotate: 0 }}
                  transition={{ duration: 3, ease: "easeOut" }}
                >
                  {wheelPrizes.map((prize, index) => (
                    <div
                      key={prize.id}
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${index * 60}deg)`,
                        transformOrigin: 'center'
                      }}
                    >
                      <div
                        className="absolute w-1/2 h-1/2"
                        style={{
                          backgroundColor: prize.color,
                          transformOrigin: 'bottom right',
                          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                        }}
                      />
                    </div>
                  ))}
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                </div>
              </div>

              <div className="text-center">
                {spinResult ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mb-4"
                  >
                    <p className="text-xl font-bold text-green-600">You won: {spinResult}!</p>
                  </motion.div>
                ) : (
                  <div className="mb-4 space-y-2">
                    {wheelPrizes.map((prize) => (
                      <div key={prize.id} className="text-sm text-gray-600">
                        <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: prize.color }} />
                        {prize.name}
                      </div>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 font-semibold"
                >
                  {isSpinning ? 'Spinning...' : 'Spin Now!'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Withdraw Your Reward</h3>
              <p className="text-gray-600 mb-4">
                Enter your UPI ID to withdraw your cash reward. Admin approval required.
              </p>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi or 1234567890@paytm"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleWithdraw}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}