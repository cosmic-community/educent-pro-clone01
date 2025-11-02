'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { SyllabusItem } from '@/types'

interface SyllabusTrackerProps {
    items: SyllabusItem[]
    detailed?: boolean
}

export default function SyllabusTracker({ items, detailed = false }: SyllabusTrackerProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    
    const toggleItem = (id: string) => {
        setExpandedItems(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }
    
    const groupedItems = items.reduce((acc, item) => {
        const subject = item.metadata?.subject?.value || 'Other'
        if (!acc[subject]) {
            acc[subject] = []
        }
        acc[subject].push(item)
        return acc
    }, {} as Record<string, SyllabusItem[]>)
    
    const completedCount = items.filter(item => item.metadata?.completed_by_lecturer).length
    const progressPercentage = items.length > 0 ? (completedCount / items.length) * 100 : 0
    
    return (
        <motion.div 
            className="bg-white/90 backdrop-blur rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <h2 className="text-lg font-semibold mb-4">Syllabus Tracker</h2>
            
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="text-sm font-semibold">
                        {completedCount} / {items.length} completed
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </div>
            
            <div className="space-y-4">
                {Object.entries(groupedItems).map(([subject, subjectItems]) => (
                    <motion.div 
                        key={subject} 
                        className="border-l-4 border-primary-500 pl-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="font-medium text-gray-900 mb-2">{subject}</h3>
                        <div className="space-y-2">
                            {subjectItems.map((item) => (
                                <motion.div 
                                    key={item.id}
                                    whileHover={{ x: 5 }}
                                    className="cursor-pointer"
                                >
                                    <div 
                                        className="flex items-center space-x-3"
                                        onClick={() => detailed && toggleItem(item.id)}
                                    >
                                        <div className={`w-4 h-4 rounded-full ${
                                            item.metadata?.completed_by_lecturer 
                                                ? 'bg-green-500' 
                                                : 'bg-gray-300'
                                        }`} />
                                        <span className={`text-sm ${
                                            item.metadata?.completed_by_lecturer 
                                                ? 'text-gray-700' 
                                                : 'text-gray-500'
                                        }`}>
                                            {item.metadata?.chapter || item.title}
                                        </span>
                                        {detailed && (
                                            <motion.span
                                                animate={{ rotate: expandedItems.includes(item.id) ? 90 : 0 }}
                                                className="text-gray-400"
                                            >
                                                ▶
                                            </motion.span>
                                        )}
                                    </div>
                                    
                                    {detailed && expandedItems.includes(item.id) && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mt-2 ml-7 p-3 bg-gray-50 rounded-lg text-sm text-gray-600"
                                        >
                                            <div dangerouslySetInnerHTML={{ __html: item.metadata?.content || '' }} />
                                            {item.metadata?.completion_date && (
                                                <p className="mt-2 text-xs text-green-600">
                                                    Completed on: {new Date(item.metadata.completion_date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}