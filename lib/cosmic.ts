import { createBucketClient } from '@cosmicjs/sdk';
import type { 
    User, 
    Class, 
    Reward, 
    SyllabusItem, 
    Query, 
    Notification, 
    Institute,
    Assignment,
    Attendance,
    Message,
    QuestionPaper
} from '@/types';

export const cosmic = createBucketClient({
    bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
    readKey: process.env.COSMIC_READ_KEY as string,
    writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Helper function for safe error handling
function hasStatus(error: unknown): error is { status: number } {
    return typeof error === 'object' && error !== null && 'status' in error;
}

// Institute functions
export async function getInstitutes(): Promise<Institute[]> {
    try {
        const response = await cosmic.objects
            .find({ type: 'institutes' })
            .props(['id', 'slug', 'title', 'metadata'])
            .depth(1);
        
        return response.objects as Institute[];
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch institutes');
    }
}

export async function createInstitute(data: any): Promise<Institute> {
    try {
        const response = await cosmic.objects.insertOne({
            title: data.title,
            type: 'institutes',
            metadata: data.metadata
        });
        
        return response.object as Institute;
    } catch (error) {
        throw new Error('Failed to create institute');
    }
}

export async function deleteInstitute(id: string): Promise<void> {
    try {
        await cosmic.objects.deleteOne(id);
    } catch (error) {
        throw new Error('Failed to delete institute');
    }
}

// User functions
export async function getUsers(instituteId?: string): Promise<User[]> {
    try {
        const query: any = { type: 'users' };
        if (instituteId) {
            query['metadata.institute_id'] = instituteId;
        }
        
        const response = await cosmic.objects
            .find(query)
            .props(['id', 'slug', 'title', 'metadata'])
            .depth(1);
        
        return response.objects as User[];
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch users');
    }
}

export async function getUserBySlug(slug: string): Promise<User | null> {
    try {
        const response = await cosmic.objects
            .findOne({ type: 'users', slug })
            .depth(1);
        
        return response.object as User;
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return null;
        }
        throw new Error('Failed to fetch user');
    }
}

export async function createUser(data: any): Promise<User> {
    try {
        const response = await cosmic.objects.insertOne({
            title: data.title,
            type: 'users',
            metadata: data.metadata
        });
        
        return response.object as User;
    } catch (error) {
        throw new Error('Failed to create user');
    }
}

// Class functions
export async function getClasses(instituteId?: string): Promise<Class[]> {
    try {
        const query: any = { type: 'classes' };
        if (instituteId) {
            query['metadata.institute_id'] = instituteId;
        }
        
        const response = await cosmic.objects
            .find(query)
            .props(['id', 'slug', 'title', 'metadata'])
            .depth(1);
        
        return response.objects as Class[];
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch classes');
    }
}

// Assignment functions
export async function getAssignments(classId?: string, instituteId?: string): Promise<Assignment[]> {
    try {
        const query: any = { type: 'assignments' };
        if (classId) {
            query['metadata.class_id'] = classId;
        }
        if (instituteId) {
            query['metadata.institute_id'] = instituteId;
        }
        
        const response = await cosmic.objects
            .find(query)
            .props(['id', 'slug', 'title', 'metadata'])
            .depth(1);
        
        // Sort by due date
        const assignments = response.objects as Assignment[];
        return assignments.sort((a, b) => {
            const dateA = new Date(a.metadata?.due_date || '').getTime();
            const dateB = new Date(b.metadata?.due_date || '').getTime();
            return dateA - dateB;
        });
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch assignments');
    }
}

export async function createAssignment(data: any): Promise<Assignment> {
    try {
        const response = await cosmic.objects.insertOne({
            title: data.title,
            type: 'assignments',
            metadata: data.metadata
        });
        
        return response.object as Assignment;
    } catch (error) {
        throw new Error('Failed to create assignment');
    }
}

export async function submitAssignment(assignmentId: string, submission: any): Promise<void> {
    try {
        const assignment = await cosmic.objects.findOne({ id: assignmentId }).depth(1);
        const submissions = assignment.object.metadata?.submissions || [];
        
        submissions.push(submission);
        
        await cosmic.objects.updateOne(assignmentId, {
            metadata: {
                submissions: submissions
            }
        });
    } catch (error) {
        throw new Error('Failed to submit assignment');
    }
}

// Attendance functions
export async function getAttendance(studentId?: string, classId?: string): Promise<Attendance[]> {
    try {
        const query: any = { type: 'attendance' };
        if (studentId) {
            query['metadata.student_id'] = studentId;
        }
        if (classId) {
            query['metadata.class_id'] = classId;
        }
        
        const response = await cosmic.objects
            .find(query)
            .props(['id', 'slug', 'title', 'metadata'])
            .depth(1);
        
        // Sort by date
        const attendance = response.objects as Attendance[];
        return attendance.sort((a, b) => {
            const dateA = new Date(a.metadata?.date || '').getTime();
            const dateB = new Date(b.metadata?.date || '').getTime();
            return dateB - dateA;
        });
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch attendance');
    }
}

export async function markAttendance(data: any): Promise<Attendance> {
    try {
        const response = await cosmic.objects.insertOne({
            title: `Attendance - ${data.metadata.date}`,
            type: 'attendance',
            metadata: data.metadata
        });
        
        return response.object as Attendance;
    } catch (error) {
        throw new Error('Failed to mark attendance');
    }
}

// Message functions
export async function getMessages(classId?: string, instituteId?: string): Promise<Message[]> {
    try {
        const query: any = { type: 'messages' };
        if (classId) {
            query['metadata.class_id'] = classId;
        }
        if (instituteId) {
            query['metadata.institute_id'] = instituteId;
        }
        
        const response = await cosmic.objects
            .find(query)
            .props(['id', 'slug', 'title', 'metadata'])
            .depth(1);
        
        // Sort by created date
        const messages = response.objects as Message[];
        return messages.sort((a, b) => {
            const dateA = new Date(a.created_at || '').getTime();
            const dateB = new Date(b.created_at || '').getTime();
            return dateB - dateA;
        });
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch messages');
    }
}

export async function createMessage(data: any): Promise<Message> {
    try {
        const response = await cosmic.objects.insertOne({
            title: data.title,
            type: 'messages',
            metadata: data.metadata
        });
        
        return response.object as Message;
    } catch (error) {
        throw new Error('Failed to create message');
    }
}

export async function saveMessage(messageId: string, userId: string): Promise<void> {
    try {
        const message = await cosmic.objects.findOne({ id: messageId }).depth(1);
        const savedBy = message.object.metadata?.saved_by || [];
        
        if (!savedBy.includes(userId)) {
            savedBy.push(userId);
            
            await cosmic.objects.updateOne(messageId, {
                metadata: {
                    saved_by: savedBy
                }
            });
        }
    } catch (error) {
        throw new Error('Failed to save message');
    }
}

// Reward functions
export async function getRewards(studentId?: string): Promise<Reward[]> {
    try {
        const query: any = { type: 'rewards' };
        if (studentId) {
            query['metadata.student'] = studentId;
        }
        
        const response = await cosmic.objects
            .find(query)
            .props(['id', 'slug', 'title', 'metadata'])
            .depth(1);
        
        // Manual sorting by created_at
        const rewards = response.objects as Reward[];
        return rewards.sort((a, b) => {
            const dateA = new Date(a.created_at || '').getTime();
            const dateB = new Date(b.created_at || '').getTime();
            return dateB - dateA;
        });
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch rewards');
    }
}

export async function createReward(data: any): Promise<Reward> {
    try {
        const response = await cosmic.objects.insertOne({
            title: data.title,
            type: 'rewards',
            metadata: data.metadata
        });
        
        return response.object as Reward;
    } catch (error) {
        throw new Error('Failed to create reward');
    }
}

export async function updateRewardStatus(id: string, status: string, notes?: string): Promise<void> {
    try {
        const reward = await cosmic.objects.findOne({ id }).depth(1);
        const history = reward.object.metadata?.workflow_history || [];
        
        history.push({
            status,
            timestamp: new Date().toISOString(),
            actor: 'system',
            notes
        });
        
        await cosmic.objects.updateOne(id, {
            metadata: {
                status,
                workflow_history: history
            }
        });
    } catch (error) {
        throw new Error('Failed to update reward status');
    }
}

// Question Paper functions
export async function generateQuestionPaper(data: any): Promise<QuestionPaper> {
    try {
        const response = await cosmic.objects.insertOne({
            title: data.title,
            type: 'question-papers',
            metadata: data.metadata
        });
        
        return response.object as QuestionPaper;
    } catch (error) {
        throw new Error('Failed to generate question paper');
    }
}

// Syllabus functions
export async function getSyllabusItems(classId?: string, instituteId?: string): Promise<SyllabusItem[]> {
    try {
        const query: any = { type: 'syllabus-items' };
        if (classId) {
            query['metadata.class_id'] = classId;
        }
        if (instituteId) {
            query['metadata.institute_id'] = instituteId;
        }
        
        const response = await cosmic.objects
            .find(query)
            .props(['id', 'slug', 'title', 'metadata'])
            .depth(1);
        
        // Manual sorting by order_index
        const items = response.objects as SyllabusItem[];
        return items.sort((a, b) => {
            const orderA = a.metadata?.order_index || 0;
            const orderB = b.metadata?.order_index || 0;
            return orderA - orderB;
        });
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch syllabus items');
    }
}

export async function updateSyllabusCompletion(id: string, completed: boolean): Promise<void> {
    try {
        await cosmic.objects.updateOne(id, {
            metadata: {
                completed_by_lecturer: completed,
                completion_date: completed ? new Date().toISOString() : null
            }
        });
    } catch (error) {
        throw new Error('Failed to update syllabus completion');
    }
}

// Query functions
export async function getQueries(lecturerId?: string, studentId?: string): Promise<Query[]> {
    try {
        const query: any = { type: 'queries' };
        if (lecturerId) {
            query['metadata.lecturer'] = lecturerId;
        }
        if (studentId) {
            query['metadata.student'] = studentId;
        }
        
        const response = await cosmic.objects
            .find(query)
            .props(['id', 'slug', 'title', 'metadata'])
            .depth(1);
        
        return response.objects as Query[];
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch queries');
    }
}

export async function createQuery(data: any): Promise<Query> {
    try {
        const response = await cosmic.objects.insertOne({
            title: data.title,
            type: 'queries',
            metadata: data.metadata
        });
        
        return response.object as Query;
    } catch (error) {
        throw new Error('Failed to create query');
    }
}

export async function replyToQuery(queryId: string, reply: any): Promise<void> {
    try {
        const query = await cosmic.objects.findOne({ id: queryId }).depth(1);
        const replies = query.object.metadata?.replies || [];
        
        replies.push(reply);
        
        await cosmic.objects.updateOne(queryId, {
            metadata: {
                replies: replies,
                status: 'answered'
            }
        });
    } catch (error) {
        throw new Error('Failed to reply to query');
    }
}

// Notification functions
export async function getNotifications(userId?: string): Promise<Notification[]> {
    try {
        const query: any = { type: 'notifications' };
        if (userId) {
            query['metadata.user'] = userId;
        }
        
        const response = await cosmic.objects
            .find(query)
            .props(['id', 'slug', 'title', 'metadata'])
            .depth(1);
        
        // Manual sorting by created_at (newest first)
        const notifications = response.objects as Notification[];
        return notifications.sort((a, b) => {
            const dateA = new Date(a.created_at || '').getTime();
            const dateB = new Date(b.created_at || '').getTime();
            return dateB - dateA;
        });
    } catch (error) {
        if (hasStatus(error) && error.status === 404) {
            return [];
        }
        throw new Error('Failed to fetch notifications');
    }
}

export async function createNotification(data: any): Promise<Notification> {
    try {
        const response = await cosmic.objects.insertOne({
            title: data.title,
            type: 'notifications',
            metadata: data.metadata
        });
        
        return response.object as Notification;
    } catch (error) {
        throw new Error('Failed to create notification');
    }
}