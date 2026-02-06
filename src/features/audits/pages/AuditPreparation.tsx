import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronDown, BookOpen, FileText, HelpCircle } from 'lucide-react';
import { useAudit } from '../api';
import { Skeleton, StatusBadge } from '../components';
import type { AuditArea, AuditScope } from '../types';

export const AuditPreparation: React.FC = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const navigate = useNavigate();

    const { data: audit, loading, error } = useAudit(auditId || '');
    const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
    const [expandedScopes, setExpandedScopes] = useState<Set<string>>(new Set());

    const toggleArea = (areaId: string) => {
        const newExpanded = new Set(expandedAreas);
        if (newExpanded.has(areaId)) {
            newExpanded.delete(areaId);
        } else {
            newExpanded.add(areaId);
        }
        setExpandedAreas(newExpanded);
    };

    const toggleScope = (scopeId: string) => {
        const newExpanded = new Set(expandedScopes);
        if (newExpanded.has(scopeId)) {
            newExpanded.delete(scopeId);
        } else {
            newExpanded.add(scopeId);
        }
        setExpandedScopes(newExpanded);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="bg-white border-b border-slate-200">
                    <div className="max-w-5xl mx-auto px-6 py-6">
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-5 w-96" />
                    </div>
                </div>
                <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
                            <Skeleton className="h-6 w-48 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !audit) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <p className="text-red-600">{error || 'Audit not found'}</p>
                    <button
                        onClick={() => navigate('/audits')}
                        className="mt-4 text-primary hover:underline"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <button
                        onClick={() => navigate('/audits')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-slate-900">{audit.projectName}</h1>
                                <StatusBadge status={audit.status} />
                            </div>
                            <p className="text-slate-500">
                                Audit scheduled for {formatDate(audit.auditDate)}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <div className="px-4 py-2 bg-slate-100 rounded-lg">
                                <span className="text-slate-500">Template:</span>
                                <span className="ml-2 font-medium text-slate-700">{audit.templateName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info banner */}
            <div className="max-w-5xl mx-auto px-6 py-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-4">
                    <BookOpen size={24} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Preparation View</h3>
                        <p className="text-blue-700 text-sm">
                            Review the questionnaire structure below to understand what will be assessed during the audit.
                            This view is read-only and meant to help you prepare for the upcoming audit.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content - Areas, Scopes, Questions */}
            <div className="max-w-5xl mx-auto px-6 py-4 pb-12">
                <div className="space-y-4">
                    {audit.areas.map((area) => (
                        <AreaAccordion
                            key={area.id}
                            area={area}
                            isExpanded={expandedAreas.has(area.id)}
                            onToggle={() => toggleArea(area.id)}
                            expandedScopes={expandedScopes}
                            onToggleScope={toggleScope}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Area Accordion Component
interface AreaAccordionProps {
    area: AuditArea;
    isExpanded: boolean;
    onToggle: () => void;
    expandedScopes: Set<string>;
    onToggleScope: (scopeId: string) => void;
}

const AreaAccordion: React.FC<AreaAccordionProps> = ({
    area,
    isExpanded,
    onToggle,
    expandedScopes,
    onToggleScope,
}) => {
    const totalQuestions = area.scopes.reduce((sum, scope) => sum + scope.questions.length, 0);

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Area Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-primary" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-lg font-semibold text-slate-900">{area.name}</h2>
                        <p className="text-sm text-slate-500">
                            {area.scopes.length} scopes • {totalQuestions} questions • {area.weightage}% weightage
                        </p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronDown size={20} className="text-slate-400" />
                ) : (
                    <ChevronRight size={20} className="text-slate-400" />
                )}
            </button>

            {/* Area Content */}
            {isExpanded && (
                <div className="border-t border-slate-200 px-5 py-4 space-y-3 bg-slate-50">
                    {area.scopes.map((scope) => (
                        <ScopeAccordion
                            key={scope.id}
                            scope={scope}
                            isExpanded={expandedScopes.has(scope.id)}
                            onToggle={() => onToggleScope(scope.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Scope Accordion Component
interface ScopeAccordionProps {
    scope: AuditScope;
    isExpanded: boolean;
    onToggle: () => void;
}

const ScopeAccordion: React.FC<ScopeAccordionProps> = ({ scope, isExpanded, onToggle }) => {
    return (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {/* Scope Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-base font-medium text-slate-800">{scope.name}</span>
                    <span className="text-sm text-slate-400">({scope.questions.length} questions)</span>
                </div>
                {isExpanded ? (
                    <ChevronDown size={16} className="text-slate-400" />
                ) : (
                    <ChevronRight size={16} className="text-slate-400" />
                )}
            </button>

            {/* Questions */}
            {isExpanded && (
                <div className="border-t border-slate-100 divide-y divide-slate-100">
                    {scope.questions.map((question, index) => (
                        <div key={question.id} className="p-4 flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <HelpCircle size={14} className="text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-700">
                                    <span className="text-slate-400 mr-2">Q{index + 1}.</span>
                                    {question.text}
                                </p>
                                {question.isMandatory && (
                                    <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 rounded">
                                        Mandatory
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AuditPreparation;
