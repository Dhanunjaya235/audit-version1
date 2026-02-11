import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, FolderOpen } from 'lucide-react';
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchTemplateDetail, saveTemplate, setTemplateName } from "@/store/slices/templatesSlice";
import { AuditAreasList } from "@/components/templates/AuditAreasList";
import { ScopesPanel } from "@/components/templates/ScopesPanel";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { calculateTemplateTotal } from "@/utils/calculations";
import type { AuditArea } from "@/types/audit.types";

export const TemplateDetail: React.FC = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const template = useAppSelector(state =>
        state.templates.templates.find(t => t.id === templateId)
    );
    const selectedAuditAreaId = useAppSelector(state => state.auditAreas.selectedAuditAreaId);
    // Add loading/error/saving selection
    const loading = useAppSelector(state => state.templates.loading);
    const saving = useAppSelector(state => state.templates.saving);
    const error = useAppSelector(state => state.templates.error);

    const [localName, setLocalName] = useState('');

    // Fetch detail on mount
    useEffect(() => {
        if (templateId) {
            dispatch(fetchTemplateDetail(templateId));
        }
    }, [dispatch, templateId]);

    // Sync local name with template name
    useEffect(() => {
        if (template) {
            setLocalName(template.name);
        }
    }, [template]);

    if (!template && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Not Found</h2>
                    <p className="text-gray-600 mb-4">{error || "The template you're looking for doesn't exist."}</p>
                    <Button onClick={() => navigate('/templates')}>
                        Back to Templates
                    </Button>
                </div>
            </div>
        );
    }

    if (loading && !template) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading template...</p>
                </div>
            </div>
        );
    }

    // Safety check if template is still undefined (e.g. during loading but selector didn't catch it yet?)
    if (!template) return null;

    const selectedAuditArea = template.auditAreas.find((a: AuditArea) => a.id === selectedAuditAreaId);
    const { total, isValid } = calculateTemplateTotal(template.auditAreas);

    const validateTemplate = (t: typeof template): string[] => {
        const errors: string[] = [];

        if (t.auditAreas.length === 0) {
            errors.push('Template must have at least one audit area.');
        }

        t.auditAreas.forEach(area => {
            if (area.scopes.length === 0) {
                errors.push(`Area "${area.name}" has no scopes.`);
            }
            area.scopes.forEach(scope => {
                if (scope.questions.length === 0) {
                    errors.push(`Scope "${scope.name}" in area "${area.name}" has no questions.`);
                }
                scope.questions.forEach(q => {
                    if (!q.options || q.options.length === 0) {
                        errors.push(`Question "${q.text.substring(0, 20)}${q.text.length > 20 ? '...' : ''}" in scope "${scope.name}" has no options.`);
                    }
                });
            });
        });
        return errors;
    };

    const validationErrors = loading ? [] : validateTemplate(template);
    const isSaveEnabled = isValid && validationErrors.length === 0 && !saving && !loading;

    const handleSave = async () => {
        // 1. Update name inthe store if changed locally
        if (localName.trim() && localName.trim() !== template.name) {
            dispatch(setTemplateName({
                id: template.id,
                name: localName.trim(),
            }));
        }

        // 2. Dispatch save with the LATEST state (wait for redux? or construct it)
        const currentTemplate = {
            ...template,
            name: localName.trim()
        };

        try {
            // Update to use the new object payload signature { template, originalId }
            const resultAction = await dispatch(saveTemplate({
                template: currentTemplate,
                originalId: template.id
            }));

            if (saveTemplate.fulfilled.match(resultAction)) {
                const newId = resultAction.payload.result.id;
                if (newId !== template.id) {
                    // URL update if ID changed (e.g. from draft to persistent)
                    navigate(`/templates/${newId}`, { replace: true });
                }
            }

            // Optional: Success notification
        } catch (err) {
            console.error("Failed to save", err);
        }
    };

    const handleNameChange = (newName: string) => {
        setLocalName(newName);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-8xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/templates')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Templates
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                            <input
                                type="text"
                                value={localName}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primary outline-none transition-colors w-full"
                                placeholder="Template Name"
                            />
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!isSaveEnabled}
                            className="flex items-center gap-2"
                        >
                            {saving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save size={20} />
                            )}
                            {saving ? 'Saving...' : 'Save Template'}
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <ProgressBar current={total} target={100} />
                    </div>


                    {/* Validation Warning - Weightage */}
                    {!isValid && !loading && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 animate-fade-in">
                            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-semibold text-yellow-900 mb-1">Save Disabled</h4>
                                <p className="text-sm text-yellow-800">
                                    Total weightage must equal exactly 100% to save this template.
                                    Current total: {total.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Validation Warning - Incomplete Structure */}
                    {validationErrors.length > 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 animate-fade-in">
                            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-semibold text-yellow-900 mb-1">Incomplete Template</h4>
                                <ul className="list-disc list-inside text-sm text-yellow-800">
                                    {validationErrors.slice(0, 5).map((err: string, idx: number) => (
                                        <li key={idx}>{err}</li>
                                    ))}
                                    {validationErrors.length > 5 && <li>...and {validationErrors.length - 5} more issues</li>}
                                </ul>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Every area must have at least one scope, every scope must have at least one question, and every question must have at least one option.
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
                            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading indicator when detail API is fetching */}
                {loading && template && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 animate-fade-in">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-blue-800 font-medium">Loading template details...</p>
                    </div>
                )}

                {/* Two Column Layout */}
                {!loading && template && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Audit Areas */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 h-[calc(100vh-400px)] min-h-[500px]">
                        <AuditAreasList auditAreas={template.auditAreas} templateId={template.id} saving={saving} />
                    </div>

                    {/* Right Column - Scopes & Questions */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 h-[calc(100vh-400px)] min-h-[500px]">
                        {selectedAuditArea ? (
                            <ScopesPanel auditArea={selectedAuditArea} templateId={template.id} saving={saving} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <FolderOpen className="mx-auto mb-4 text-gray-400" size={48} />
                                    <p className="text-lg">Select an audit area to view its scopes and questions</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>)}
            </div>
        </div>
    );
};
