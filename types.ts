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
    metadata?: {
      subjects?: string[];
      qualifications?: string;
      department?: string;
      years_of_service?: number;
      children?: string[];
      contact_preference?: string;
    };
  };
}

export type UserRole = 'student' | 'lecturer' | 'parent' | 'principal' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'frozen';

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
  };
}

// Reward types
export interface Reward extends CosmicObject {
  type: 'rewards';
  metadata: {
    student?: string | User;
    streak_days?: number;
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
  };
}

export type RewardStatus = 'pending' | 'lecturer_verified' | 'principal_recommended' | 'admin_approved' | 'rejected';

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

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'reward' | 'query';