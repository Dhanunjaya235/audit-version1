import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, FolderOpen } from 'lucide-react';
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateTemplate } from "@/store/slices/templatesSlice";
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

    const [templateName, setTemplateName] = useState(template?.name || '');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (template) {
            setTemplateName(template.name);
        }
    }, [template]);

    if (!template) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Not Found</h2>
                    <p className="text-gray-600 mb-4">The template you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/templates')}>
                        Back to Templates
                    </Button>
                </div>
            </div>
        );
    }

    const selectedAuditArea = template.auditAreas.find((a: AuditArea) => a.id === selectedAuditAreaId);
    const { total, isValid } = calculateTemplateTotal(template.auditAreas);

    const handleSave = () => {
        if (templateName.trim() && templateName !== template.name) {
            dispatch(updateTemplate({
                id: template.id,
                name: templateName.trim(),
            }));
        }
        setHasChanges(false);
    };

    const handleNameChange = (newName: string) => {
        setTemplateName(newName);
        setHasChanges(newName.trim() !== template.name);
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
                                value={templateName}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primary outline-none transition-colors w-full"
                                placeholder="Template Name"
                            />
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={!isValid || (!hasChanges && isValid)}
                            className="flex items-center gap-2"
                        >
                            <Save size={20} />
                            Save Template
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <ProgressBar current={total} target={100} />
                    </div>

                    {/* Validation Warning */}
                    {!isValid && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 animate-fade-in">
                            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-semibold text-yellow-900 mb-1">Save Disabled</h4>
                                <p className="text-sm text-yellow-800">
                                    Total weightage must equal exactly 100% to save this template.
                                    Current total: {total.toFixed(1)}%
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Note: Audit area weightages are automatically calculated from question percentages.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Audit Areas */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 h-[calc(100vh-400px)] min-h-[500px]">
                        <AuditAreasList auditAreas={template.auditAreas} templateId={template.id} />
                    </div>

                    {/* Right Column - Scopes & Questions */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 h-[calc(100vh-400px)] min-h-[500px]">
                        {selectedAuditArea ? (
                            <ScopesPanel auditArea={selectedAuditArea} templateId={template.id} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <FolderOpen className="mx-auto mb-4 text-gray-400" size={48} />
                                    <p className="text-lg">Select an audit area to view its scopes and questions</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
