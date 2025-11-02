import { createBucketClient } from '@cosmicjs/sdk';
import type { User, Class, Reward, SyllabusItem, Query, Notification } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Helper function for safe error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// User functions
export async function getUsers(): Promise<User[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'users' })
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

// Class functions
export async function getClasses(): Promise<Class[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'classes' })
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

// Reward functions
export async function getRewards(): Promise<Reward[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'rewards' })
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

export async function updateRewardStatus(id: string, status: string): Promise<void> {
  try {
    await cosmic.objects.updateOne(id, {
      metadata: {
        status: status
      }
    });
  } catch (error) {
    throw new Error('Failed to update reward status');
  }
}

// Syllabus functions
export async function getSyllabusItems(): Promise<SyllabusItem[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'syllabus-items' })
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

// Query functions
export async function getQueries(): Promise<Query[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'queries' })
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

// Notification functions
export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'notifications' })
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