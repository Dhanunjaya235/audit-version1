// Question Option interface for rating options
export interface QuestionOption {
    id: string;
    label: string;
    value: number; // Numerical value for rating calculation
}

// Question interface
export interface Question {
    id: string;
    scopeId: string;
    text: string;
    percentage: number;
    options?: QuestionOption[]; // Optional answer options with numerical values
}

// Scope interface
export interface Scope {
    id: string;
    auditAreaId: string;
    name: string;
    questions: Question[];
}

// Audit Area interface
export interface AuditArea {
    id: string;
    templateId: string;
    name: string;
    weightage: number;
    scopes: Scope[];
}

// Template interface
export interface Template {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    auditAreas: AuditArea[];
}

// Redux State Shapes
export interface TemplatesState {
    templates: Template[];
    selectedTemplateId: string | null;
    loading: boolean;
    error: string | null;
}

export interface AuditAreasState {
    selectedAuditAreaId: string | null;
}

export interface ScopesState {
    expandedScopeIds: string[];
}

// Utility Types
export interface PercentageCalculation {
    total: number;
    isValid: boolean;
}

export interface ValidationResult {
    isValid: boolean;
    message?: string;
}
