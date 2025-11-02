// Base Cosmic object interface
export interface CosmicObject {
    id: string;
    slug: string;
    title: string;
    content?: string;
    metadata: Record<string, any>;
    type: string;
    created_at: string;
    modified_at: string;
}

// User types
export interface User extends CosmicObject {
    type: 'users';
    metadata: {
        email?: string;
        username?: string;
        display_name?: string;
        role?: {
            key: UserRole;
            value: string;
        };
        dob?: string;
        status?: {
            key: UserStatus;
            value: string;
        };
        password_hash?: string;
        profile_image?: {
            url: string;
            imgix_url: string;
        };
        institute_id?: string;
        connection_code?: string;
        parent_connection?: string;
        metadata?: {
            subjects?: string[];
            qualifications?: string;
            department?: string;
            years_of_service?: number;
            children?: string[];
            contact_preference?: string;
            class_id?: string;
            grade?: string;
            section?: string;
        };
    };
}

export type UserRole = 'student' | 'lecturer' | 'parent' | 'principal' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'frozen';

// Institute types
export interface Institute extends CosmicObject {
    type: 'institutes';
    metadata: {
        name?: string;
        code?: string;
        address?: string;
        principal_id?: string;
        status?: {
            key: 'active' | 'inactive';
            value: string;
        };
        connection_codes?: {
            principal: string;
            faculty: string;
        };
        logo?: {
            url: string;
            imgix_url: string;
        };
    };
}

// Class types
export interface Class extends CosmicObject {
    type: 'classes';
    metadata: {
        name?: string;
        grade?: {
            key: string;
            value: string;
        };
        subjects?: string[];
        class_teacher?: string | User;
        room_number?: string;
        academic_year?: string;
        institute_id?: string;
        timetable?: TimetableEntry[];
    };
}

export interface TimetableEntry {
    day: string;
    time: string;
    subject: string;
    room: string;
}

// Assignment types
export interface Assignment extends CosmicObject {
    type: 'assignments';
    metadata: {
        title?: string;
        description?: string;
        subject?: string;
        due_date?: string;
        lecturer_id?: string;
        class_id?: string;
        institute_id?: string;
        attachments?: FileMetafield[];
        submissions?: AssignmentSubmission[];
    };
}

export interface AssignmentSubmission {
    student_id: string;
    submitted_at: string;
    file_url?: string;
    grade?: string;
    feedback?: string;
    ai_evaluation?: {
        score: number;
        mistakes: string[];
        suggestions: string[];
    };
}

// Attendance types
export interface Attendance extends CosmicObject {
    type: 'attendance';
    metadata: {
        student_id?: string;
        class_id?: string;
        institute_id?: string;
        date?: string;
        status?: {
            key: 'present' | 'absent' | 'late';
            value: string;
        };
        qr_code?: string;
        marked_by?: string;
        timestamp?: string;
    };
}

// Message/Notice types
export interface Message extends CosmicObject {
    type: 'messages';
    metadata: {
        title?: string;
        content?: string;
        sender_id?: string;
        recipient_type?: 'all' | 'class' | 'individual';
        recipient_ids?: string[];
        class_id?: string;
        institute_id?: string;
        type?: {
            key: 'notice' | 'announcement' | 'circular';
            value: string;
        };
        important?: boolean;
        attachments?: FileMetafield[];
        saved_by?: string[];
    };
}

// Reward types
export interface Reward extends CosmicObject {
    type: 'rewards';
    metadata: {
        student?: string | User;
        streak_days?: number;
        reward_type?: 'attendance_60' | 'attendance_365' | 'academic' | 'extracurricular';
        prize?: string;
        cash_amount?: number;
        upi_id?: string;
        evidence?: {
            type: string;
            description: string;
            dates?: string;
        };
        status?: {
            key: RewardStatus;
            value: string;
        };
        workflow_history?: WorkflowEntry[];
        evidence_files?: FileMetafield[];
        withdrawal_status?: 'pending' | 'approved' | 'disbursed' | 'rejected';
    };
}

export type RewardStatus = 'pending' | 'lecturer_verified' | 'principal_recommended' | 'admin_approved' | 'rejected' | 'claimed';

export interface WorkflowEntry {
    status: string;
    timestamp: string;
    actor: string;
    notes?: string;
}

export interface FileMetafield {
    url: string;
    imgix_url: string;
}

// Syllabus types
export interface SyllabusItem extends CosmicObject {
    type: 'syllabus-items';
    metadata: {
        subject?: {
            key: string;
            value: string;
        };
        chapter?: string;
        order_index?: number;
        content?: string;
        published?: boolean;
        created_by?: string | User;
        learning_resources?: FileMetafield[];
        class_id?: string;
        institute_id?: string;
        completed_by_lecturer?: boolean;
        completion_date?: string;
    };
}

// Query types
export interface Query extends CosmicObject {
    type: 'queries';
    metadata: {
        student?: string | User;
        lecturer?: string | User;
        subject?: {
            key: string;
            value: string;
        };
        query_text?: string;
        status?: {
            key: QueryStatus;
            value: string;
        };
        replies?: Reply[];
        attachments?: FileMetafield[];
        is_personal?: boolean;
        institute_id?: string;
        class_id?: string;
    };
}

export type QueryStatus = 'pending' | 'answered' | 'resolved';

export interface Reply {
    author: string;
    timestamp: string;
    message: string;
}

// Notification types
export interface Notification extends CosmicObject {
    type: 'notifications';
    metadata: {
        user?: string | User;
        type?: {
            key: NotificationType;
            value: string;
        };
        payload?: any;
        read?: boolean;
    };
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reward' | 'query' | 'attendance' | 'assignment';

// Question Paper types
export interface QuestionPaper extends CosmicObject {
    type: 'question-papers';
    metadata: {
        title?: string;
        subject?: string;
        topics?: string[];
        difficulty?: number;
        num_mcq?: number;
        num_short?: number;
        num_long?: number;
        questions?: Question[];
        created_by?: string;
        class_id?: string;
        institute_id?: string;
    };
}

export interface Question {
    id: string;
    type: 'mcq' | 'short' | 'long';
    question: string;
    options?: string[];
    correct_answer?: string;
    marks: number;
}