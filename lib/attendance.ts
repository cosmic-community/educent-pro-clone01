import type { Attendance } from '@/types';

export function calculateAttendanceStreak(attendance: Attendance[], studentId: string): number {
    if (!attendance || attendance.length === 0) return 0;
    
    // Filter attendance for specific student
    const studentAttendance = attendance
        .filter(a => a.metadata?.student_id === studentId)
        .sort((a, b) => {
            const dateA = new Date(a.metadata?.date || '').getTime();
            const dateB = new Date(b.metadata?.date || '').getTime();
            return dateB - dateA; // Most recent first
        });
    
    if (studentAttendance.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < studentAttendance.length; i++) {
        const record = studentAttendance[i];
        if (record.metadata?.status?.key === 'present') {
            const attendanceDate = new Date(record.metadata.date || '');
            attendanceDate.setHours(0, 0, 0, 0);
            
            // Check if this is consecutive
            const expectedDate = new Date(today);
            expectedDate.setDate(expectedDate.getDate() - streak);
            
            const diffTime = Math.abs(expectedDate.getTime() - attendanceDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 1) {
                streak++;
            } else {
                break; // Streak broken
            }
        } else {
            break; // Absent day breaks the streak
        }
    }
    
    return streak;
}

export function calculateAttendancePercentage(attendance: Attendance[], studentId: string): number {
    if (!attendance || attendance.length === 0) return 100;
    
    const studentAttendance = attendance.filter(a => a.metadata?.student_id === studentId);
    if (studentAttendance.length === 0) return 100;
    
    const presentDays = studentAttendance.filter(a => a.metadata?.status?.key === 'present').length;
    return Math.round((presentDays / studentAttendance.length) * 100);
}

export function generateQRCode(): string {
    // Generate a unique QR code for attendance
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `QR-${timestamp}-${random}`;
}

export function validateQRCode(code: string): boolean {
    if (!code || !code.startsWith('QR-')) return false;
    
    // Extract timestamp from QR code
    const parts = code.split('-');
    if (parts.length !== 3) return false;
    
    const timestamp = parseInt(parts[1]);
    const now = Date.now();
    
    // QR code is valid for 5 minutes (300000 ms)
    const fiveMinutes = 5 * 60 * 1000;
    return (now - timestamp) < fiveMinutes;
}

export function getAttendanceStatus(attendance: Attendance[], studentId: string, date: string): string {
    const record = attendance.find(
        a => a.metadata?.student_id === studentId && 
        a.metadata?.date === date
    );
    
    return record?.metadata?.status?.key || 'absent';
}