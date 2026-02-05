import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Template, TemplatesState } from '@/types/audit.types';
import { generateId, calculateAuditAreaWeightage } from '@/utils/calculations';

// Mock initial data
const mockTemplates: Template[] = [
    {
        id: '1',
        name: 'Financial Audit Template',
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-01-15T10:00:00Z',
        auditAreas: [
            {
                id: 'aa1',
                templateId: '1',
                name: 'Revenue Recognition',
                weightage: 40,
                scopes: [
                    {
                        id: 's1',
                        auditAreaId: 'aa1',
                        name: 'Sales Transactions',
                        questions: [
                            { id: 'q1', scopeId: 's1', text: 'Are sales properly documented?', percentage: 15 },
                            { id: 'q2', scopeId: 's1', text: 'Is revenue recognized in correct period?', percentage: 25 },
                        ],
                    },
                ],
            },
            {
                id: 'aa2',
                templateId: '1',
                name: 'Internal Controls',
                weightage: 35,
                scopes: [
                    {
                        id: 's2',
                        auditAreaId: 'aa2',
                        name: 'Access Controls',
                        questions: [
                            { id: 'q3', scopeId: 's2', text: 'Are access rights properly managed?', percentage: 20 },
                            { id: 'q4', scopeId: 's2', text: 'Is segregation of duties maintained?', percentage: 15 },
                        ],
                    },
                ],
            },
            {
                id: 'aa3',
                templateId: '1',
                name: 'Compliance',
                weightage: 25,
                scopes: [
                    {
                        id: 's3',
                        auditAreaId: 'aa3',
                        name: 'Regulatory Requirements',
                        questions: [
                            { id: 'q5', scopeId: 's3', text: 'Are all regulations followed?', percentage: 25 },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: '2',
        name: 'IT Security Audit',
        createdAt: '2026-01-20T14:30:00Z',
        updatedAt: '2026-01-20T14:30:00Z',
        auditAreas: [
            {
                id: 'aa4',
                templateId: '2',
                name: 'Network Security',
                weightage: 50,
                scopes: [
                    {
                        id: 's4',
                        auditAreaId: 'aa4',
                        name: 'Firewall Configuration',
                        questions: [
                            { id: 'q6', scopeId: 's4', text: 'Are firewalls properly configured?', percentage: 30 },
                            { id: 'q7', scopeId: 's4', text: 'Is traffic monitored?', percentage: 20 },
                        ],
                    },
                ],
            },
            {
                id: 'aa5',
                templateId: '2',
                name: 'Data Protection',
                weightage: 50,
                scopes: [
                    {
                        id: 's5',
                        auditAreaId: 'aa5',
                        name: 'Encryption',
                        questions: [
                            { id: 'q8', scopeId: 's5', text: 'Is data encrypted at rest?', percentage: 25 },
                            { id: 'q9', scopeId: 's5', text: 'Is data encrypted in transit?', percentage: 25 },
                        ],
                    },
                ],
            },
        ],
    },
];

// Helper function to recalculate audit area weightage from questions
const recalculateAuditAreaWeightage = (area: Template['auditAreas'][0]) => {
    area.weightage = calculateAuditAreaWeightage(area);
};

const initialState: TemplatesState = {
    templates: mockTemplates,
    selectedTemplateId: null,
    loading: false,
    error: null,
};

const templatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        // Template CRUD
        createTemplate: (state, action: PayloadAction<{ name: string; baseTemplateId?: string }>) => {
            const { name, baseTemplateId } = action.payload;

            if (baseTemplateId) {
                // Clone from existing template
                const baseTemplate = state.templates.find(t => t.id === baseTemplateId);
                if (baseTemplate) {
                    const newTemplate: Template = {
                        ...baseTemplate,
                        id: generateId(),
                        name,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    state.templates.push(newTemplate);
                    state.selectedTemplateId = newTemplate.id;
                }
            } else {
                // Create from scratch
                const newTemplate: Template = {
                    id: generateId(),
                    name,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    auditAreas: [],
                };
                state.templates.push(newTemplate);
                state.selectedTemplateId = newTemplate.id;
            }
        },

        updateTemplate: (state, action: PayloadAction<{ id: string; name: string }>) => {
            const template = state.templates.find(t => t.id === action.payload.id);
            if (template) {
                template.name = action.payload.name;
                template.updatedAt = new Date().toISOString();
            }
        },

        deleteTemplate: (state, action: PayloadAction<string>) => {
            state.templates = state.templates.filter(t => t.id !== action.payload);
            if (state.selectedTemplateId === action.payload) {
                state.selectedTemplateId = null;
            }
        },

        cloneTemplate: (state, action: PayloadAction<string>) => {
            const template = state.templates.find(t => t.id === action.payload);
            if (template) {
                const clonedTemplate: Template = {
                    ...template,
                    id: generateId(),
                    name: `${template.name} (Clone)`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                state.templates.push(clonedTemplate);
            }
        },

        selectTemplate: (state, action: PayloadAction<string | null>) => {
            state.selectedTemplateId = action.payload;
        },

        // Audit Area CRUD
        addAuditArea: (state, action: PayloadAction<{ templateId: string; name: string }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const newArea = {
                    id: generateId(),
                    templateId: action.payload.templateId,
                    name: action.payload.name,
                    weightage: 0,
                    scopes: [],
                };
                template.auditAreas.push(newArea);
                template.updatedAt = new Date().toISOString();
            }
        },

        updateAuditArea: (state, action: PayloadAction<{ templateId: string; areaId: string; name?: string; weightage?: number }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const area = template.auditAreas.find(a => a.id === action.payload.areaId);
                if (area) {
                    if (action.payload.name !== undefined) area.name = action.payload.name;
                    if (action.payload.weightage !== undefined) area.weightage = action.payload.weightage;
                    template.updatedAt = new Date().toISOString();
                }
            }
        },

        deleteAuditArea: (state, action: PayloadAction<{ templateId: string; areaId: string }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                template.auditAreas = template.auditAreas.filter(a => a.id !== action.payload.areaId);
                template.updatedAt = new Date().toISOString();
            }
        },

        // Scope CRUD
        addScope: (state, action: PayloadAction<{ templateId: string; areaId: string; name: string }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const area = template.auditAreas.find(a => a.id === action.payload.areaId);
                if (area) {
                    const newScope = {
                        id: generateId(),
                        auditAreaId: action.payload.areaId,
                        name: action.payload.name,
                        questions: [],
                    };
                    area.scopes.push(newScope);
                    template.updatedAt = new Date().toISOString();
                }
            }
        },

        updateScope: (state, action: PayloadAction<{ templateId: string; areaId: string; scopeId: string; name: string }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const area = template.auditAreas.find(a => a.id === action.payload.areaId);
                if (area) {
                    const scope = area.scopes.find(s => s.id === action.payload.scopeId);
                    if (scope) {
                        scope.name = action.payload.name;
                        template.updatedAt = new Date().toISOString();
                    }
                }
            }
        },

        deleteScope: (state, action: PayloadAction<{ templateId: string; areaId: string; scopeId: string }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const area = template.auditAreas.find(a => a.id === action.payload.areaId);
                if (area) {
                    area.scopes = area.scopes.filter(s => s.id !== action.payload.scopeId);
                    template.updatedAt = new Date().toISOString();
                }
            }
        },

        // Question CRUD
        addQuestion: (state, action: PayloadAction<{ templateId: string; areaId: string; scopeId: string; text: string; percentage: number }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const area = template.auditAreas.find(a => a.id === action.payload.areaId);
                if (area) {
                    const scope = area.scopes.find(s => s.id === action.payload.scopeId);
                    if (scope) {
                        const newQuestion = {
                            id: generateId(),
                            scopeId: action.payload.scopeId,
                            text: action.payload.text,
                            percentage: action.payload.percentage,
                        };
                        scope.questions.push(newQuestion);
                        // Recalculate audit area weightage
                        recalculateAuditAreaWeightage(area);
                        template.updatedAt = new Date().toISOString();
                    }
                }
            }
        },

        updateQuestion: (state, action: PayloadAction<{ templateId: string; areaId: string; scopeId: string; questionId: string; text?: string; percentage?: number }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const area = template.auditAreas.find(a => a.id === action.payload.areaId);
                if (area) {
                    const scope = area.scopes.find(s => s.id === action.payload.scopeId);
                    if (scope) {
                        const question = scope.questions.find(q => q.id === action.payload.questionId);
                        if (question) {
                            if (action.payload.text !== undefined) question.text = action.payload.text;
                            if (action.payload.percentage !== undefined) question.percentage = action.payload.percentage;
                            // Recalculate audit area weightage
                            recalculateAuditAreaWeightage(area);
                            template.updatedAt = new Date().toISOString();
                        }
                    }
                }
            }
        },

        deleteQuestion: (state, action: PayloadAction<{ templateId: string; areaId: string; scopeId: string; questionId: string }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const area = template.auditAreas.find(a => a.id === action.payload.areaId);
                if (area) {
                    const scope = area.scopes.find(s => s.id === action.payload.scopeId);
                    if (scope) {
                        scope.questions = scope.questions.filter(q => q.id !== action.payload.questionId);
                        // Recalculate audit area weightage
                        recalculateAuditAreaWeightage(area);
                        template.updatedAt = new Date().toISOString();
                    }
                }
            }
        },
    },
});

export const {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    cloneTemplate,
    selectTemplate,
    addAuditArea,
    updateAuditArea,
    deleteAuditArea,
    addScope,
    updateScope,
    deleteScope,
    addQuestion,
    updateQuestion,
    deleteQuestion,
} = templatesSlice.actions;

export default templatesSlice.reducer;
