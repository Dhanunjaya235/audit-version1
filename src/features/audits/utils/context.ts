// Context helper for accessing host application context
import type { UserRole } from '../types';

interface AppContext {
    userId: string;
    role: UserRole;
    token: string;
}

declare global {
    interface Window {
        __APP_CONTEXT__?: AppContext;
    }
}

/**
 * Get the current user's role from the host application context
 */
export const getCurrentUserRole = (): UserRole => {
    const context = window.__APP_CONTEXT__;
    if (!context?.role) {
        console.warn('APP_CONTEXT not available, defaulting to Delivery role');
        return 'Delivery';
    }
    return context.role;
};

/**
 * Get the current user's ID from the host application context
 */
export const getCurrentUserId = (): string => {
    const context = window.__APP_CONTEXT__;
    if (!context?.userId) {
        console.warn('APP_CONTEXT not available, user ID unknown');
        return '';
    }
    return context.userId;
};

/**
 * Get the auth token from the host application context
 */
export const getAuthToken = (): string => {
    const context = window.__APP_CONTEXT__;
    if (!context?.token) {
        console.warn('APP_CONTEXT not available, token unknown');
        return '';
    }
    return context.token;
};

/**
 * Check if the current user has a specific role
 */
export const hasRole = (role: UserRole): boolean => {
    return getCurrentUserRole() === role;
};

/**
 * Check if the current user is a Practice Lead
 */
export const isPracticeLead = (): boolean => hasRole('PracticeLead');

/**
 * Check if the current user is an Auditor
 */
export const isAuditor = (): boolean => hasRole('Auditor');

/**
 * Check if the current user is from Delivery team
 */
export const isDelivery = (): boolean => hasRole('Delivery');

/**
 * Check if the current user is Leadership
 */
export const isLeadership = (): boolean => hasRole('Leadership');

/**
 * Check if the current user can create audits
 */
export const canCreateAudit = (): boolean => isPracticeLead();

/**
 * Check if the current user can finalize audits
 */
export const canFinalizeAudit = (): boolean => isPracticeLead();

/**
 * Check if the current user can conduct audits (fill responses)
 */
export const canConductAudit = (): boolean => isAuditor();

/**
 * Check if the current user can create action items
 */
export const canCreateActions = (): boolean => isPracticeLead();

/**
 * Check if the current user can view preparation
 */
export const canViewPreparation = (): boolean => isDelivery() || isAuditor() || isPracticeLead();

/**
 * Check if the current user can only view reports (no edit capabilities)
 */
export const isViewOnly = (): boolean => isLeadership();
