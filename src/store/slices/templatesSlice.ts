import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Template, TemplatesState } from '@/types/audit.types';
import { generateId, calculateAuditAreaWeightage } from '@/utils/calculations';
import { templateApi, isNewId } from '@/services/templateApi';

// Async Thunks

export const fetchTemplates = createAsyncThunk(
    'templates/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await templateApi.getAll();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch templates');
        }
    }
);

export const fetchTemplateDetail = createAsyncThunk(
    'templates/fetchDetail',
    async (id: string, { rejectWithValue }) => {
        try {
            if (isNewId(id)) {
                return rejectWithValue("Cannot fetch detail for draft template");
            }
            return await templateApi.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch template detail');
        }
    }
);

// Async thunk to create a draft from an existing template (Fetch + Client-side Clone)
export const createDraftFromExisting = createAsyncThunk(
    'templates/createDraftFromExisting',
    async ({ name, baseTemplateId, newId }: { name: string; baseTemplateId: string; newId: string }, { rejectWithValue }) => {
        try {
            // First fetch the full source template to ensure we have all nested data
            const sourceTemplate = await templateApi.getById(baseTemplateId);
            return { name, sourceTemplate, newId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch base template for cloning');
        }
    }
);

export const saveTemplate = createAsyncThunk(
    'templates/save',
    async ({ template, originalId }: { template: Template; originalId: string }, { rejectWithValue }) => {
        try {
            if (isNewId(template.id)) {
                // It's a draft, create new on server
                const created = await templateApi.create(template);
                return { result: created, originalId };
            } else {
                // Update existing
                const updated = await templateApi.update(template.id, template);
                return { result: updated, originalId };
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to save template');
        }
    }
);

export const deleteTemplate = createAsyncThunk(
    'templates/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            if (!isNewId(id)) {
                await templateApi.delete(id);
            }
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to delete template');
        }
    }
);

export const cloneTemplate = createAsyncThunk(
    'templates/clone',
    async (id: string, { rejectWithValue }) => {
        try {
            const source = await templateApi.getById(id);
            const newName = `${source.name} (Clone)`;
            return await templateApi.clone(id, newName);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to clone template');
        }
    }
);

const initialState: TemplatesState = {
    templates: [],
    selectedTemplateId: null,
    loading: false,
    saving: false,
    error: null,
};

// Helper function to recalculate audit area weightage from questions
const recalculateAuditAreaWeightage = (area: Template['auditAreas'][0]) => {
    area.weightage = calculateAuditAreaWeightage(area);
};

// Helper to deep clone and assign new IDs logic
const deepCloneWithNewIds = (base: Template, newId: string, newName: string): Template => {
    return {
        ...base,
        id: newId,
        name: newName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Deep copy areas to ensure we don't mutate original ref
        auditAreas: (base.auditAreas || []).map((a: any) => {
            const newAreaId = generateId();
            return {
                ...a,
                id: newAreaId,
                templateId: newId,
                scopes: (a.scopes || []).map((s: any) => {
                    const newScopeId = generateId();
                    return {
                        ...s,
                        id: newScopeId,
                        auditAreaId: newAreaId,
                        questions: (s.questions || []).map((q: any) => ({
                            ...q,
                            id: generateId(),
                            scopeId: newScopeId,
                            options: (q.options || []).map((o: any) => ({
                                ...o,
                                id: generateId(),
                            }))
                        }))
                    };
                })
            };
        })
    };
};

const templatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        selectTemplate: (state, action: PayloadAction<string | null>) => {
            state.selectedTemplateId = action.payload;
        },

        // Synchrounous Draft Creation (From Scratch only)
        initDraftTemplate: (state, action: PayloadAction<{ name: string; id?: string }>) => {
            const { name, id } = action.payload;
            const newId = id || generateId();

            const newTemplate: Template = {
                id: newId,
                name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                auditAreas: [],
            };

            state.templates.push(newTemplate);
            state.selectedTemplateId = newTemplate.id;
        },

        // Local state modifiers (Draft editing)
        setTemplateName: (state, action: PayloadAction<{ id: string; name: string }>) => {
            const template = state.templates.find(t => t.id === action.payload.id);
            if (template) {
                template.name = action.payload.name;
                template.updatedAt = new Date().toISOString();
            }
        },

        // Audit Area CRUD
        addAuditArea: (state, action: PayloadAction<{ templateId: string; name: string }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const newArea = {
                    id: generateId(), // Temp ID
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
                            options: [
                                { id: generateId(), label: "Level 0", value: 0 },
                                { id: generateId(), label: "Level 1", value: 1 },
                                { id: generateId(), label: "Level 2", value: 2 },
                                { id: generateId(), label: "Level 3", value: 3 },
                                { id: generateId(), label: "Level 4", value: 4 },
                                { id: generateId(), label: "Level 5", value: 5 }
                            ]
                        };
                        scope.questions.push(newQuestion);
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
                        recalculateAuditAreaWeightage(area);
                        template.updatedAt = new Date().toISOString();
                    }
                }
            }
        },

        // Question Option CRUD
        addQuestionOption: (state, action: PayloadAction<{ templateId: string; areaId: string; scopeId: string; questionId: string; label: string; value: number }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const area = template.auditAreas.find(a => a.id === action.payload.areaId);
                if (area) {
                    const scope = area.scopes.find(s => s.id === action.payload.scopeId);
                    if (scope) {
                        const question = scope.questions.find(q => q.id === action.payload.questionId);
                        if (question) {
                            if (!question.options) {
                                question.options = [];
                            }
                            const newOption = {
                                id: generateId(),
                                label: action.payload.label,
                                value: action.payload.value,
                            };
                            question.options.push(newOption);
                            template.updatedAt = new Date().toISOString();
                        }
                    }
                }
            }
        },

        updateQuestionOption: (state, action: PayloadAction<{ templateId: string; areaId: string; scopeId: string; questionId: string; optionId: string; label?: string; value?: number }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const area = template.auditAreas.find(a => a.id === action.payload.areaId);
                if (area) {
                    const scope = area.scopes.find(s => s.id === action.payload.scopeId);
                    if (scope) {
                        const question = scope.questions.find(q => q.id === action.payload.questionId);
                        if (question && question.options) {
                            const option = question.options.find(o => o.id === action.payload.optionId);
                            if (option) {
                                if (action.payload.label !== undefined) option.label = action.payload.label;
                                if (action.payload.value !== undefined) option.value = action.payload.value;
                                template.updatedAt = new Date().toISOString();
                            }
                        }
                    }
                }
            }
        },

        deleteQuestionOption: (state, action: PayloadAction<{ templateId: string; areaId: string; scopeId: string; questionId: string; optionId: string }>) => {
            const template = state.templates.find(t => t.id === action.payload.templateId);
            if (template) {
                const area = template.auditAreas.find(a => a.id === action.payload.areaId);
                if (area) {
                    const scope = area.scopes.find(s => s.id === action.payload.scopeId);
                    if (scope) {
                        const question = scope.questions.find(q => q.id === action.payload.questionId);
                        if (question && question.options) {
                            question.options = question.options.filter(o => o.id !== action.payload.optionId);
                            template.updatedAt = new Date().toISOString();
                        }
                    }
                }
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch All
        builder.addCase(fetchTemplates.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTemplates.fulfilled, (state, action) => {
            state.loading = false;
            state.templates = action.payload;
        });
        builder.addCase(fetchTemplates.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Detail
        builder.addCase(fetchTemplateDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTemplateDetail.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.templates.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.templates[index] = action.payload;
            } else {
                state.templates.push(action.payload);
            }
        });
        builder.addCase(fetchTemplateDetail.rejected, (state, action) => {
            // Silence error if we just tried to fetch a draft
            if (action.payload !== "Cannot fetch detail for draft template") {
                state.loading = false;
                state.error = action.payload as string;
            } else {
                state.loading = false;
            }
        });

        // Create Draft From Existing
        builder.addCase(createDraftFromExisting.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createDraftFromExisting.fulfilled, (state, action) => {
            state.loading = false;
            const { name, sourceTemplate, newId } = action.payload;
            const newTemplate = deepCloneWithNewIds(sourceTemplate, newId, name);
            state.templates.push(newTemplate);
            state.selectedTemplateId = newId;
        });
        builder.addCase(createDraftFromExisting.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Save (Update / Create Real)
        builder.addCase(saveTemplate.pending, (state) => {
            state.saving = true;
            state.error = null;
        });
        builder.addCase(saveTemplate.fulfilled, (state, action) => {
            state.saving = false;
            const { result, originalId } = action.payload;

            // Find by original ID (which might be temp) and replace
            const index = state.templates.findIndex(t => t.id === originalId);
            if (index !== -1) {
                state.templates[index] = result;
                // Update selected ID if needed
                if (state.selectedTemplateId === originalId) {
                    state.selectedTemplateId = result.id;
                }
            } else {
                state.templates.push(result);
            }
        });
        builder.addCase(saveTemplate.rejected, (state, action) => {
            state.saving = false;
            state.error = action.payload as string;
        });

        // Delete
        builder.addCase(deleteTemplate.fulfilled, (state, action) => {
            state.templates = state.templates.filter(t => t.id !== action.payload);
            if (state.selectedTemplateId === action.payload) {
                state.selectedTemplateId = null;
            }
        });

        // Clone (Server-side)
        builder.addCase(cloneTemplate.fulfilled, (state, action) => {
            state.templates.push(action.payload);
        });
    },
});

export const {
    selectTemplate,
    initDraftTemplate,
    setTemplateName,
    addAuditArea,
    updateAuditArea,
    deleteAuditArea,
    addScope,
    updateScope,
    deleteScope,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addQuestionOption,
    updateQuestionOption,
    deleteQuestionOption,
} = templatesSlice.actions;

export default templatesSlice.reducer;
