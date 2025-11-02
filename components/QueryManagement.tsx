'use client'

import { useState } from 'react'
import type { Query } from '@/types'

interface QueryManagementProps {
  queries: Query[]
}

export default function QueryManagement({ queries }: QueryManagementProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending')
  
  const pendingQueries = queries.filter(q => q.metadata?.status?.key === 'pending')
  const resolvedQueries = queries.filter(q => q.metadata?.status?.key === 'resolved')
  
  const displayQueries = activeTab === 'pending' ? pendingQueries : resolvedQueries

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Student Query Management</h2>
      
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'pending' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending ({pendingQueries.length})
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'resolved' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Resolved ({resolvedQueries.length})
        </button>
      </div>
      
      <div className="space-y-4">
        {displayQueries.map((query) => (
          <div key={query.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {query.metadata?.subject?.value}
                  </span>
                  <span className="text-xs text-gray-500">
                    • {new Date(query.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {query.metadata?.query_text}
                </p>
                {query.metadata?.replies && query.metadata.replies.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600 mb-1">Latest Reply:</p>
                    <p className="text-sm text-gray-700">
                      {query.metadata.replies[query.metadata.replies.length - 1]?.message}
                    </p>
                  </div>
                )}
              </div>
              {activeTab === 'pending' && (
                <button className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600">
                  Reply
                </button>
              )}
            </div>
          </div>
        ))}
        {displayQueries.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No {activeTab} queries
          </p>
        )}
      </div>
    </div>
  )
}