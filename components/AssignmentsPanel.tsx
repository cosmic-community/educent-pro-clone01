'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Assignment {
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

interface AssignmentsPanelProps {
  assignments: Assignment[]
}

export default function AssignmentsPanel({ assignments = [] }: AssignmentsPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'submitted' | 'graded'>('pending')
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)

  // Demo data if no assignments provided
  const demoAssignments: Assignment[] = assignments.length > 0 ? assignments : [
    {
      id: '1',
      title: 'Quadratic Equations Problem Set',
      subject: 'Mathematics',
      dueDate: '2024-02-15',
      status: 'pending',
      description: 'Solve problems 1-20 from Chapter 4. Show all working steps.',
      lecturer: 'Prof. Michael Chen'
    },
    {
      id: '2',
      title: 'Essay on Climate Change',
      subject: 'Science',
      dueDate: '2024-02-10',
      status: 'submitted',
      description: 'Write a 1000-word essay on the impacts of climate change.',
      lecturer: 'Dr. Sarah Johnson'
    },
    {
      id: '3',
      title: 'Python Programming Exercise',
      subject: 'Computer Science',
      dueDate: '2024-02-05',
      status: 'graded',
      grade: 'A+',
      description: 'Complete the Python exercises on loops and functions.',
      lecturer: 'Prof. Michael Chen'
    }
  ]

  const filteredAssignments = demoAssignments.filter(a => a.status === selectedTab)

  const handleSubmit = async (assignmentId: string) => {
    if (!submissionFile) {
      toast.error('Please select a file to submit')
      return
    }

    // In production, this would upload the file
    toast.success('Assignment submitted successfully!')
    setSelectedAssignment(null)
    setSubmissionFile(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Assignments</h2>
        
        <div className="flex space-x-4 mb-6">
          {(['pending', 'submitted', 'graded'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === tab
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 text-sm">
                ({demoAssignments.filter(a => a.status === tab).length})
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          <AnimatePresence mode="wait">
            {filteredAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedAssignment(assignment)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{assignment.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{assignment.description}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                      <span className="text-gray-500">
                        <span className="font-medium">Subject:</span> {assignment.subject}
                      </span>
                      <span className="text-gray-500">
                        <span className="font-medium">Due:</span> {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="text-gray-500">
                        <span className="font-medium">By:</span> {assignment.lecturer}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {assignment.status === 'pending' && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Pending
                      </span>
                    )}
                    {assignment.status === 'submitted' && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Submitted
                      </span>
                    )}
                    {assignment.status === 'graded' && (
                      <div className="text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm block">
                          Graded
                        </span>
                        {assignment.grade && (
                          <span className="text-lg font-bold text-green-600 mt-1 block">
                            {assignment.grade}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No {selectedTab} assignments</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAssignment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{selectedAssignment.title}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-gray-600">{selectedAssignment.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subject</label>
                      <p className="mt-1">{selectedAssignment.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Due Date</label>
                      <p className="mt-1">{new Date(selectedAssignment.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1 capitalize">{selectedAssignment.status}</p>
                    </div>
                  </div>

                  {selectedAssignment.status === 'pending' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Submit Your Work
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                      />
                      <button
                        onClick={() => handleSubmit(selectedAssignment.id)}
                        className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                      >
                        Submit Assignment
                      </button>
                    </div>
                  )}

                  {selectedAssignment.status === 'graded' && selectedAssignment.grade && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800">Grade Received</h4>
                      <p className="text-3xl font-bold text-green-600 mt-2">{selectedAssignment.grade}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedAssignment(null)}
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