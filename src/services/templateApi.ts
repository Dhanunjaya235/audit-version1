
import api from './api';
import type { Template, AuditArea, Scope, Question, QuestionOption } from '@/types/audit.types';

// Map backend 'areas' to frontend 'auditAreas'
// Map backend 'isactive' (ignored in FE types currently)
// Map date strings

export const templateApi = {
    getAll: async (): Promise<Template[]> => {
        const response = await api.get('/templates');
        return response.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            auditAreas: (item.areas || []).map((area: any) => ({
                id: area.id,
                templateId: area.template_id,
                name: area.name,
                weightage: area.weightage,
                scopes: [] // List view doesn't return scopes usually
            }))
        }));
    },

    getById: async (id: string): Promise<Template> => {
        const response = await api.get(`/templates/${id}`);
        const data = response.data;

        return {
            id: data.id,
            name: data.name,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            auditAreas: (data.areas || []).map((area: any) => ({
                id: area.id,
                templateId: area.template_id,
                name: area.name,
                weightage: area.weightage,
                scopes: (area.scopes || []).map((scope: any) => ({
                    id: scope.id,
                    auditAreaId: scope.area_id,
                    name: scope.name,
                    questions: (scope.questions || []).map((q: any) => ({
                        id: q.id,
                        scopeId: q.scope_id,
                        text: q.text,
                        percentage: q.percentage,
                        options: (q.options || []).map((o: any) => ({
                            id: o.id,
                            label: o.label,
                            value: o.value
                        }))
                    }))
                }))
            }))
        };
    },

    create: async (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> => {
        // Backend Create expects { name: "...", areas: [...] } full tree
        const payload = {
            name: template.name,
            areas: (template.auditAreas || []).map(area => ({
                name: area.name,
                weightage: area.weightage,
                scopes: (area.scopes || []).map(scope => ({
                    name: scope.name,
                    questions: (scope.questions || []).map(q => ({
                        text: q.text,
                        percentage: q.percentage,
                        is_mandatory: true,
                        options: (q.options || []).map(o => ({
                            label: o.label,
                            value: o.value
                        }))
                    }))
                }))
            }))
        };
        const response = await api.post('/templates', payload);
        // The response is TemplateDetailResponse
        const data = response.data;
        return {
            id: data.id,
            name: data.name,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            auditAreas: (data.areas || []).map((area: any) => ({
                id: area.id,
                templateId: area.template_id,
                name: area.name,
                weightage: area.weightage,
                scopes: (area.scopes || []).map((scope: any) => ({
                    id: scope.id,
                    auditAreaId: scope.area_id,
                    name: scope.name,
                    questions: (scope.questions || []).map((q: any) => ({
                        id: q.id,
                        scopeId: q.scope_id,
                        text: q.text,
                        percentage: q.percentage,
                        options: (q.options || []).map((o: any) => ({
                            id: o.id,
                            label: o.label,
                            value: o.value
                        }))
                    }))
                }))
            }))
        };
    },

    update: async (id: string, template: Template): Promise<Template> => {
        // Transform frontend Template back to Backend Schema
        // We need to send the FULL tree
        const payload = {
            name: template.name,
            areas: template.auditAreas.map(area => ({
                id: isNewId(area.id) ? undefined : area.id,
                name: area.name,
                weightage: area.weightage,
                scopes: area.scopes.map(scope => ({
                    id: isNewId(scope.id) ? undefined : scope.id,
                    name: scope.name,
                    questions: scope.questions.map(q => ({
                        id: isNewId(q.id) ? undefined : q.id,
                        text: q.text,
                        percentage: q.percentage,
                        is_mandatory: true,
                        options: (q.options || []).map(o => ({
                            id: isNewId(o.id) ? undefined : o.id,
                            label: o.label,
                            value: o.value
                        }))
                    }))
                }))
            }))
        };

        const response = await api.put(`/templates/${id}`, payload);
        const data = response.data;

        // Return mapped back
        return {
            id: data.id,
            name: data.name,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            auditAreas: (data.areas || []).map((area: any) => ({
                id: area.id,
                templateId: area.template_id,
                name: area.name,
                weightage: area.weightage,
                scopes: (area.scopes || []).map((scope: any) => ({
                    id: scope.id,
                    auditAreaId: scope.area_id,
                    name: scope.name,
                    questions: (scope.questions || []).map((q: any) => ({
                        id: q.id,
                        scopeId: q.scope_id,
                        text: q.text,
                        percentage: q.percentage,
                        options: (q.options || []).map((o: any) => ({
                            id: o.id,
                            label: o.label,
                            value: o.value
                        }))
                    }))
                }))
            }))
        };
    },

    clone: async (id: string, newName: string): Promise<Template> => {
        // We first need to get the source template details to populate the clone payload
        // because the backend `clone` `TemplateCloneRequest` requires `areas` list.
        const sourceResponse = await api.get(`/templates/${id}`);
        const source = sourceResponse.data;

        const payload = {
            name: newName,
            areas: (source.areas || []).map((area: any) => ({
                name: area.name,
                weightage: area.weightage,
                scopes: (area.scopes || []).map((scope: any) => ({
                    name: scope.name,
                    questions: (scope.questions || []).map((q: any) => ({
                        text: q.text,
                        percentage: q.percentage,
                        is_mandatory: q.is_mandatory || true,
                        options: (q.options || []).map((o: any) => ({
                            label: o.label,
                            value: o.value
                        }))
                    }))
                }))
            }))
        };

        const response = await api.post(`/templates/${id}/clone`, payload);
        const data = response.data;

        return {
            id: data.id,
            name: data.name,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            auditAreas: (data.areas || []).map((area: any) => ({
                id: area.id,
                templateId: area.template_id,
                name: area.name,
                weightage: area.weightage,
                scopes: (area.scopes || []).map((scope: any) => ({
                    id: scope.id,
                    auditAreaId: scope.area_id,
                    name: scope.name,
                    questions: (scope.questions || []).map((q: any) => ({
                        id: q.id,
                        scopeId: q.scope_id,
                        text: q.text,
                        percentage: q.percentage,
                        options: (q.options || []).map((o: any) => ({
                            id: o.id,
                            label: o.label,
                            value: o.value
                        }))
                    }))
                }))
            }))
        };
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/templates/${id}`);
    }
};

// Helper to identify temp IDs
// Export it so other files can check if an ID is temp
export function isNewId(id: string): boolean {
    if (!id) return true;
    return id.length !== 36;
}
