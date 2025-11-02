import { getRewards, getSyllabusItems, getQueries, getNotifications, getUserBySlug, getAssignments, getMessages, getAttendance } from '@/lib/cosmic'
import StudentDashboard from '@/components/StudentDashboard'

export default async function StudentPage() {
    // For demo purposes, using a default student
    const studentUsername = 'ewilson2024'
    const user = await getUserBySlug(`student-${studentUsername}`)
    
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Student Not Found</h1>
                    <p className="text-gray-600 mt-2">Please login with valid credentials</p>
                </div>
            </div>
        )
    }
    
    const [rewards, syllabusItems, queries, notifications, assignments, messages, attendance] = await Promise.all([
        getRewards(user.id),
        getSyllabusItems(user.metadata?.metadata?.class_id),
        getQueries(undefined, user.id),
        getNotifications(user.id),
        getAssignments(user.metadata?.metadata?.class_id),
        getMessages(user.metadata?.metadata?.class_id),
        getAttendance(user.id)
    ])
    
    return <StudentDashboard 
        rewards={rewards}
        syllabusItems={syllabusItems}
        queries={queries}
        notifications={notifications}
        user={user}
        assignments={assignments}
        messages={messages}
        attendance={attendance}
    />
}