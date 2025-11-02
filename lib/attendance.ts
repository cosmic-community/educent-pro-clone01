interface AttendanceRecord {
  date: string
  student: string
  present: boolean
}

export function calculateAttendanceStreak(attendance: AttendanceRecord[], username: string): number {
  if (!attendance || attendance.length === 0) return 0

  // Filter records for the specific student
  const studentAttendance = attendance
    .filter(record => record.student === username)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (studentAttendance.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < studentAttendance.length; i++) {
    const recordDate = new Date(studentAttendance[i].date)
    recordDate.setHours(0, 0, 0, 0)

    // Calculate expected date (today minus streak days)
    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - streak)

    // If the student was present on the expected date, increment streak
    if (studentAttendance[i].present && 
        recordDate.getTime() === expectedDate.getTime()) {
      streak++
    } else if (!studentAttendance[i].present) {
      // If absent, streak breaks
      break
    }
  }

  return streak
}

export function checkPerfectAttendance(attendance: AttendanceRecord[], username: string, days: number): boolean {
  const recentAttendance = attendance
    .filter(record => record.student === username)
    .filter(record => {
      const recordDate = new Date(record.date)
      const daysAgo = new Date()
      daysAgo.setDate(daysAgo.getDate() - days)
      return recordDate >= daysAgo
    })

  // Check if all records show present
  return recentAttendance.length > 0 && recentAttendance.every(record => record.present)
}