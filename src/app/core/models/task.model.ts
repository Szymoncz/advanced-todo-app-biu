export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Label {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    notes: string;
    status: TaskStatus;
    priority: Priority;
    labels: Label[];
    projectId: string | null;
    assignedTo: string | null;
    dueDate: string | null;
    recurrence: RecurrenceType;
    progress: number;
    attachments: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: string;
    name: string;
    color: string;
}

export interface AppUser {
    id: string;
    name: string;
    avatar: string;
    role: 'admin'|'member';
}