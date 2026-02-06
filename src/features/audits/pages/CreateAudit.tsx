import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, FileText, Loader2 } from 'lucide-react';
import { useProjects, useTemplates, useUsers, useCreateAudit } from '../api';
import { MultiUserSelect, Skeleton } from '../components';
import type { CreateAuditRequest } from '../types';

interface FormErrors {
    projectId?: string;
    templateId?: string;
    auditDate?: string;
    participantIds?: string;
}

export const CreateAudit: React.FC = () => {
    const navigate = useNavigate();

    const { data: projects, loading: projectsLoading } = useProjects();
    const { data: templates, loading: templatesLoading } = useTemplates();
    const { data: users, loading: usersLoading } = useUsers();
    const { createAudit, loading: creating, error: createError } = useCreateAudit();

    const [formData, setFormData] = useState<CreateAuditRequest>({
        projectId: '',
        templateId: '',
        auditDate: '',
        participantIds: [],
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Get tomorrow's date as minimum date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.projectId) {
            newErrors.projectId = 'Please select a project';
        }
        if (!formData.templateId) {
            newErrors.templateId = 'Please select a template';
        }
        if (!formData.auditDate) {
            newErrors.auditDate = 'Please select an audit date';
        }
        if (formData.participantIds.length === 0) {
            newErrors.participantIds = 'Please select at least one participant';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        const result = await createAudit(formData);
        if (result) {
            navigate(`/audits/${result.id}/preparation`);
        }
    };

    const selectedTemplate = templates?.find((t) => t.id === formData.templateId);
    const isLoading = projectsLoading || templatesLoading || usersLoading;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-3xl mx-auto px-6 py-6">
                    <button
                        onClick={() => navigate('/audits')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Schedule New Audit</h1>
                    <p className="text-slate-500 mt-1">
                        Configure and schedule a new audit for a project
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto px-6 py-8">
                {isLoading ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
                            {/* Project Selection */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                    <FileText size={16} className="text-slate-400" />
                                    Project
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.projectId}
                                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                    className={`
                                        w-full px-4 py-3 text-base
                                        bg-white border rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                        ${errors.projectId ? 'border-red-300' : 'border-slate-300'}
                                    `}
                                >
                                    <option value="">Select a project</option>
                                    {projects?.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name} ({project.code})
                                        </option>
                                    ))}
                                </select>
                                {errors.projectId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
                                )}
                            </div>

                            {/* Template Selection */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                    <FileText size={16} className="text-slate-400" />
                                    Audit Template
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.templateId}
                                    onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                                    className={`
                                        w-full px-4 py-3 text-base
                                        bg-white border rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                        ${errors.templateId ? 'border-red-300' : 'border-slate-300'}
                                    `}
                                >
                                    <option value="">Select a template</option>
                                    {templates?.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.templateId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.templateId}</p>
                                )}

                                {/* Template preview */}
                                {selectedTemplate && (
                                    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">
                                                {selectedTemplate.description || 'Standard audit template'}
                                            </span>
                                            <span className="text-sm font-medium text-primary">
                                                {selectedTemplate.areasCount} areas
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Audit Date */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                    <Calendar size={16} className="text-slate-400" />
                                    Audit Date
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.auditDate}
                                    min={minDate}
                                    onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })}
                                    className={`
                                        w-full px-4 py-3 text-base
                                        bg-white border rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                        ${errors.auditDate ? 'border-red-300' : 'border-slate-300'}
                                    `}
                                />
                                {errors.auditDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.auditDate}</p>
                                )}
                            </div>

                            {/* Participants */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                    <Users size={16} className="text-slate-400" />
                                    Participants
                                    <span className="text-red-500">*</span>
                                </label>
                                <MultiUserSelect
                                    users={users || []}
                                    selectedIds={formData.participantIds}
                                    onChange={(ids) => setFormData({ ...formData, participantIds: ids })}
                                    placeholder="Select audit participants"
                                    error={errors.participantIds}
                                />
                            </div>
                        </div>

                        {/* Error message */}
                        {createError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                                {createError}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/audits')}
                                className="
                                    px-6 py-2.5 text-slate-700 font-medium
                                    bg-slate-100 rounded-lg
                                    hover:bg-slate-200 transition-colors
                                "
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creating}
                                className="
                                    flex items-center gap-2 px-6 py-2.5
                                    bg-primary text-white font-medium rounded-lg
                                    hover:bg-primary-dark transition-all duration-200
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    hover:shadow-lg
                                "
                            >
                                {creating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Audit'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CreateAudit;
