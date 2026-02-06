// Audit Management Types

// User roles in the system
export type UserRole = 'PracticeLead' | 'Auditor' | 'Delivery' | 'Leadership';

// Audit status types
export type AuditStatus = 'Draft' | 'Scheduled' | 'In Progress' | 'Completed' | 'Closed';

// Priority levels for action items
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

// Action item status
export type ActionStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

// RAG (Red, Amber, Green) health indicators
export type RAGStatus = 'Red' | 'Amber' | 'Green';

// User reference for participants and owners
export interface User {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
    avatar?: string;
}

// Project reference
export interface Project {
    id: string;
    name: string;
    description?: string;
    templateId?: string;
    code?: string;
    status?: string;
}

// Template reference (read-only in audit context)
export interface AuditTemplate {
    id: string;
    name: string;
    description?: string;
    version?: string;
    areaCount?: number;
    questionCount?: number;
    areasCount?: number;
}

// Score option for question responses
export interface ScoreOption {
    value: number;
    label: string;
    color?: string;
}

// Evidence attachment
export interface Evidence {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType?: string;
    uploadedAt?: string;
    uploadedBy?: string;
}

// Question response
export interface QuestionResponse {
    score: number | null;
    comment?: string | null;
    recommendation?: string | null;
    evidences?: Evidence[];
    isAnswered: boolean;
}

// Question within a scope
export interface AuditQuestion {
    id: string;
    text: string;
    order: number;
    isMandatory: boolean;
    weight?: number;
    options?: ScoreOption[];
    response?: QuestionResponse | null;
}

// Scope within an area
export interface AuditScope {
    id: string;
    name: string;
    order: number;
    description?: string;
    questions: AuditQuestion[];
}

// Audit area
export interface AuditArea {
    id: string;
    name: string;
    description?: string;
    order: number;
    weightage?: number;
    scopes: AuditScope[];
}

// Main Audit entity (full details for conduct/preparation screens)
export interface Audit {
    id: string;
    projectId: string;
    projectName: string;
    templateId: string;
    templateName: string;
    auditDate: string;
    scheduledDate?: string;
    status: AuditStatus;
    score?: number | null;
    ragStatus?: RAGStatus;
    createdBy: User;
    createdAt?: string;
    updatedAt?: string;
    participants: User[];
    areas: AuditArea[];
}

// Audit list item (for dashboard)
export interface AuditListItem {
    id: string;
    projectId: string;
    projectName: string;
    templateName: string;
    auditDate: string;
    status: AuditStatus;
    score?: number | null;
    ragStatus?: RAGStatus;
    participants: User[];
    createdBy: User;
}

// Action item
export interface ActionItem {
    id: string;
    auditId: string;
    title: string;
    description: string;
    owner: User;
    priority: Priority;
    dueDate: string;
    status: ActionStatus;
    createdBy: User;
    createdAt: string;
    updatedAt?: string;
}

// Audit report data
export interface AuditReport {
    id: string;
    projectName: string;
    auditDate: string;
    overallScore: number;
    ragStatus?: RAGStatus;
    isFinalized: boolean;
    finalizedAt?: string;
    finalizedBy?: string;
    areaScores: {
        areaId: string;
        areaName: string;
        score: number;
        maxScore: number;
        percentage: number;
    }[];
    findings: {
        areaId: string;
        areaName: string;
        items: {
            question: string;
            score: number;
            comment?: string;
            recommendation?: string;
        }[];
    }[];
    evidences: Evidence[];
}

// API Request/Response types
export interface CreateAuditRequest {
    projectId: string;
    templateId: string;
    auditDate: string;
    participantIds: string[];
}

export interface UpdateResponseRequest {
    questionId: string;
    score?: number | null;
    comment?: string;
    recommendation?: string;
}

export interface CreateActionRequest {
    title: string;
    description: string;
    ownerId: string;
    priority: Priority;
    dueDate: string;
}

export interface UpdateActionRequest {
    title?: string;
    description?: string;
    ownerId?: string;
    priority?: Priority;
    dueDate?: string;
    status?: ActionStatus;
}

// Filter types
export interface AuditFilters {
    projectId?: string;
    status?: AuditStatus;
    myAuditsOnly?: boolean;
}

export interface ActionFilters {
    status?: ActionStatus;
    priority?: Priority;
    ownerId?: string;
}

// Save indicator status
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
