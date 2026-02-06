// API hooks for Audit Management - Using Mock Data
import { useState, useCallback, useEffect, useRef } from 'react';
import type {
    Audit,
    AuditListItem,
    AuditFilters,
    CreateAuditRequest,
    UpdateResponseRequest,
    AuditReport,
    ActionItem,
    ActionFilters,
    CreateActionRequest,
    UpdateActionRequest,
    Project,
    AuditTemplate,
    User,
    SaveStatus
} from '../types';

// Import mock data
import {
    mockUsers,
    mockProjects,
    mockTemplates,
    mockAuditList,
    mockAuditDetails,
    mockAuditReports,
    mockActionItems,
    getCurrentUserActions,
} from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Hook response type
interface UseApiResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// =====================
// Audits API Hooks
// =====================

/**
 * Fetch list of audits with optional filters
 */
export function useAudits(filters?: AuditFilters): UseApiResult<AuditListItem[]> {
    const [data, setData] = useState<AuditListItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAudits = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await delay(500); // Simulate network delay

            let result = [...mockAuditList];

            // Apply filters
            if (filters?.projectId) {
                result = result.filter(a => a.projectId === filters.projectId);
            }
            if (filters?.status) {
                result = result.filter(a => a.status === filters.status);
            }
            if (filters?.myAuditsOnly) {
                // Simulate current user being user-2 (Michael Rodriguez - Auditor)
                const currentUserId = 'user-2';
                result = result.filter(a =>
                    a.participants.some(p => p.id === currentUserId) ||
                    a.createdBy.id === currentUserId
                );
            }

            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch audits');
        } finally {
            setLoading(false);
        }
    }, [filters?.projectId, filters?.status, filters?.myAuditsOnly]);

    useEffect(() => {
        fetchAudits();
    }, [fetchAudits]);

    return { data, loading, error, refetch: fetchAudits };
}

/**
 * Fetch single audit by ID
 */
export function useAudit(auditId: string): UseApiResult<Audit> {
    const [data, setData] = useState<Audit | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAudit = useCallback(async () => {
        if (!auditId) return;
        setLoading(true);
        setError(null);
        try {
            await delay(600); // Simulate network delay

            const result = mockAuditDetails[auditId];
            if (result) {
                setData(result);
            } else {
                setError('Audit not found');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch audit');
        } finally {
            setLoading(false);
        }
    }, [auditId]);

    useEffect(() => {
        fetchAudit();
    }, [fetchAudit]);

    return { data, loading, error, refetch: fetchAudit };
}

/**
 * Create a new audit
 */
export function useCreateAudit() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAudit = useCallback(async (data: CreateAuditRequest): Promise<Audit | null> => {
        setLoading(true);
        setError(null);
        try {
            await delay(800); // Simulate network delay

            // Find project and template
            const project = mockProjects.find(p => p.id === data.projectId);
            const template = mockTemplates.find(t => t.id === data.templateId);
            const participants = mockUsers.filter(u => data.participantIds.includes(u.id));

            if (!project || !template) {
                throw new Error('Invalid project or template');
            }

            // Create new audit (in memory - won't persist)
            const newAudit: Audit = {
                id: `audit-new-${Date.now()}`,
                projectId: data.projectId,
                projectName: project.name,
                templateId: data.templateId,
                templateName: template.name,
                auditDate: data.auditDate,
                status: 'Scheduled',
                participants,
                createdBy: mockUsers[0], // Simulate current user
                areas: [], // Would be populated from template
            };

            return newAudit;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create audit');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createAudit, loading, error };
}

/**
 * Update audit responses with autosave support
 */
export function useUpdateResponses(auditId: string) {
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const updateResponses = useCallback(async (updates: UpdateResponseRequest[]) => {
        if (!auditId) return;

        setSaveStatus('saving');
        setError(null);

        // Clear any existing timeout for the saved indicator
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        try {
            await delay(400); // Simulate network delay

            // In a real app, this would update the backend
            console.log('Saving responses:', updates);

            setSaveStatus('saved');

            // Reset to idle after 2 seconds
            saveTimeoutRef.current = setTimeout(() => {
                setSaveStatus('idle');
            }, 2000);
        } catch (err) {
            setSaveStatus('error');
            setError(err instanceof Error ? err.message : 'Failed to save responses');
        }
    }, [auditId]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return { updateResponses, saveStatus, error };
}

// =====================
// Report API Hooks
// =====================

/**
 * Fetch audit report
 */
export function useAuditReport(auditId: string): UseApiResult<AuditReport> {
    const [data, setData] = useState<AuditReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = useCallback(async () => {
        if (!auditId) return;
        setLoading(true);
        setError(null);
        try {
            await delay(500); // Simulate network delay

            const result = mockAuditReports[auditId];
            if (result) {
                setData(result);
            } else {
                setError('Report not found');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch report');
        } finally {
            setLoading(false);
        }
    }, [auditId]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    return { data, loading, error, refetch: fetchReport };
}

/**
 * Finalize an audit
 */
export function useFinalizeAudit() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const finalizeAudit = useCallback(async (auditId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await delay(1000); // Simulate network delay

            // In real app, this would update the backend
            console.log('Finalizing audit:', auditId);

            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to finalize audit');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { finalizeAudit, loading, error };
}

// =====================
// Actions API Hooks
// =====================

/**
 * Fetch actions for an audit
 */
export function useAuditActions(auditId: string, filters?: ActionFilters): UseApiResult<ActionItem[]> {
    const [data, setData] = useState<ActionItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActions = useCallback(async () => {
        if (!auditId) return;
        setLoading(true);
        setError(null);
        try {
            await delay(400); // Simulate network delay

            let result = mockActionItems.filter(a => a.auditId === auditId);

            // Apply filters
            if (filters?.status) {
                result = result.filter(a => a.status === filters.status);
            }
            if (filters?.priority) {
                result = result.filter(a => a.priority === filters.priority);
            }
            if (filters?.ownerId) {
                result = result.filter(a => a.owner.id === filters.ownerId);
            }

            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch actions');
        } finally {
            setLoading(false);
        }
    }, [auditId, filters?.status, filters?.priority, filters?.ownerId]);

    useEffect(() => {
        fetchActions();
    }, [fetchActions]);

    return { data, loading, error, refetch: fetchActions };
}

/**
 * Fetch current user's actions across all audits
 */
export function useMyActions(): UseApiResult<ActionItem[]> {
    const [data, setData] = useState<ActionItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyActions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await delay(500); // Simulate network delay

            const result = getCurrentUserActions();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch actions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyActions();
    }, [fetchMyActions]);

    return { data, loading, error, refetch: fetchMyActions };
}

/**
 * Create action item
 */
export function useCreateAction(auditId: string) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAction = useCallback(async (data: CreateActionRequest): Promise<ActionItem | null> => {
        setLoading(true);
        setError(null);
        try {
            await delay(600); // Simulate network delay

            const owner = mockUsers.find(u => u.id === data.ownerId);
            if (!owner) {
                throw new Error('Invalid owner');
            }

            const newAction: ActionItem = {
                id: `action-new-${Date.now()}`,
                auditId,
                title: data.title,
                description: data.description,
                owner,
                priority: data.priority,
                status: 'Open',
                dueDate: data.dueDate,
                createdAt: new Date().toISOString().split('T')[0],
                createdBy: mockUsers[0], // Simulate current user
            };

            return newAction;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create action');
            return null;
        } finally {
            setLoading(false);
        }
    }, [auditId]);

    return { createAction, loading, error };
}

/**
 * Update action item
 */
export function useUpdateAction(auditId: string) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateAction = useCallback(async (
        actionId: string,
        data: UpdateActionRequest
    ): Promise<ActionItem | null> => {
        setLoading(true);
        setError(null);
        try {
            await delay(300); // Simulate network delay

            // Find and update action
            const action = mockActionItems.find(a => a.id === actionId);
            if (!action) {
                throw new Error('Action not found');
            }

            const updatedAction: ActionItem = {
                ...action,
                ...data,
            };

            console.log('Updated action:', updatedAction);

            return updatedAction;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update action');
            return null;
        } finally {
            setLoading(false);
        }
    }, [auditId]);

    return { updateAction, loading, error };
}

// =====================
// Reference Data Hooks
// =====================

/**
 * Fetch projects list
 */
export function useProjects(): UseApiResult<Project[]> {
    const [data, setData] = useState<Project[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await delay(300); // Simulate network delay
            setData(mockProjects);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { data, loading, error, refetch: fetchProjects };
}

/**
 * Fetch templates list
 */
export function useTemplates(): UseApiResult<AuditTemplate[]> {
    const [data, setData] = useState<AuditTemplate[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await delay(300); // Simulate network delay
            setData(mockTemplates);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch templates');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    return { data, loading, error, refetch: fetchTemplates };
}

/**
 * Fetch users list
 */
export function useUsers(): UseApiResult<User[]> {
    const [data, setData] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await delay(200); // Simulate network delay
            setData(mockUsers);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return { data, loading, error, refetch: fetchUsers };
}

/**
 * Upload evidence file
 */
export function useUploadEvidence() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadEvidence = useCallback(async (
        auditId: string,
        questionId: string,
        file: File
    ): Promise<{ id: string; fileUrl: string } | null> => {
        setLoading(true);
        setError(null);
        try {
            await delay(1000); // Simulate upload delay

            // In a real app, this would upload to a server
            console.log('Uploading evidence:', { auditId, questionId, fileName: file.name });

            return {
                id: `evidence-${Date.now()}`,
                fileUrl: `/files/${file.name}`,
            };
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload evidence');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { uploadEvidence, loading, error };
}
