import type { Template, AuditArea, Scope, Question, PercentageCalculation } from '@/types/audit.types';

/**
 * Calculate total percentage for questions in a scope
 */
export const calculateScopeTotal = (questions: Question[]): number => {
    return questions.reduce((sum, question) => sum + question.percentage, 0);
};

/**
 * Calculate total percentage for scopes in an audit area
 */
export const calculateAuditAreaTotal = (scopes: Scope[]): number => {
    return scopes.reduce((sum, scope) => {
        const scopeTotal = calculateScopeTotal(scope.questions);
        return sum + scopeTotal;
    }, 0);
};

/**
 * Calculate audit area weightage from all questions in its scopes
 * This is the sum of all question percentages across all scopes
 */
export const calculateAuditAreaWeightage = (auditArea: AuditArea): number => {
    return auditArea.scopes.reduce((sum, scope) => {
        const scopeTotal = calculateScopeTotal(scope.questions);
        return sum + scopeTotal;
    }, 0);
};

/**
 * Calculate total percentage for all audit areas in a template
 */
export const calculateTemplateTotal = (auditAreas: AuditArea[]): PercentageCalculation => {
    const total = auditAreas.reduce((sum, area) => sum + area.weightage, 0);
    return {
        total: Math.round(total * 100) / 100, // Round to 2 decimal places
        isValid: Math.abs(total - 100) < 0.01, // Allow for floating point errors
    };
};

/**
 * Count total questions in a scope
 */
export const countScopeQuestions = (scope: Scope): number => {
    return scope.questions.length;
};

/**
 * Count total questions in an audit area
 */
export const countAuditAreaQuestions = (auditArea: AuditArea): number => {
    return auditArea.scopes.reduce((sum, scope) => sum + scope.questions.length, 0);
};

/**
 * Count total questions in a template
 */
export const countTemplateQuestions = (template: Template): number => {
    return template.auditAreas.reduce((sum, area) => sum + countAuditAreaQuestions(area), 0);
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clone a template with a new name
 */
export const cloneTemplate = (template: Template, newName: string): Template => {
    return {
        ...template,
        id: generateId(),
        name: newName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        auditAreas: template.auditAreas.map(area => ({
            ...area,
            id: generateId(),
            templateId: generateId(),
            scopes: area.scopes.map(scope => ({
                ...scope,
                id: generateId(),
                auditAreaId: generateId(),
                questions: scope.questions.map(question => ({
                    ...question,
                    id: generateId(),
                    scopeId: generateId(),
                })),
            })),
        })),
    };
};
