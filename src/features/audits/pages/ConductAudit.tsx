import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronDown,
    CheckCircle2,
    AlertCircle,
    Loader2,
    MessageSquare,
    Lightbulb,
    X,
    Plus,
    ClipboardList,
    Info,
    Check,
    Upload,
} from 'lucide-react';
import { useAudit, useUpdateResponses, useUsers } from '../api';
import { mockUsers } from '../api/mockData';
import type { AuditArea, AuditQuestion, AuditScope, Priority, User } from '../types';
import { ProgressHeader, SaveIndicator } from '../components';

// Scoring Guidelines - consistent across all questions
const SCORING_GUIDELINES = [
    { value: 0, label: 'Not Applicable', description: 'This question does not apply to the project', color: 'bg-slate-100 text-slate-600 border-slate-300' },
    { value: 1, label: 'Not Implemented', description: 'No evidence of implementation or practice', color: 'bg-red-50 text-red-700 border-red-300' },
    { value: 2, label: 'Partially Implemented', description: 'Some effort but significant gaps exist', color: 'bg-orange-50 text-orange-700 border-orange-300' },
    { value: 3, label: 'Implemented', description: 'Basic implementation in place with minor issues', color: 'bg-amber-50 text-amber-700 border-amber-300' },
    { value: 4, label: 'Well Implemented', description: 'Solid implementation meeting expectations', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
    { value: 5, label: 'Exemplary', description: 'Best-in-class implementation, exceeds expectations', color: 'bg-green-50 text-green-800 border-green-400' },
];

// Question Action Item interface
interface QuestionActionItem {
    id: string;
    questionId: string;
    title: string;
    description: string;
    owner: User;
    priority: Priority;
    dueDate: string;
}

export const ConductAudit: React.FC = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const navigate = useNavigate();

    const { data: audit, loading, error } = useAudit(auditId || '');
    const { updateResponses, saveStatus } = useUpdateResponses(auditId || '');
    const { data: users } = useUsers();

    const [activeAreaId, setActiveAreaId] = useState<string>('');
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
    const [localResponses, setLocalResponses] = useState<Record<string, {
        score: number | null;
        comment: string;
        recommendation: string;
    }>>({});

    // Action items created per question
    const [questionActionItems, setQuestionActionItems] = useState<QuestionActionItem[]>([]);
    const [actionModal, setActionModal] = useState<{ open: boolean; questionId: string; questionText: string } | null>(null);

    // Initialize active area and responses when audit loads
    useEffect(() => {
        if (audit?.areas?.length) {
            if (!activeAreaId) {
                setActiveAreaId(audit.areas[0].id);
            }

            // Initialize local responses from audit data
            const responses: Record<string, { score: number | null; comment: string; recommendation: string }> = {};
            audit.areas.forEach(area => {
                area.scopes.forEach(scope => {
                    scope.questions.forEach(q => {
                        if (q.response) {
                            responses[q.id] = {
                                score: q.response.score,
                                comment: q.response.comment || '',
                                recommendation: q.response.recommendation || '',
                            };
                        }
                    });
                });
            });
            setLocalResponses(responses);
        }
    }, [audit, activeAreaId]);

    // Calculate progress
    const progress = useMemo(() => {
        if (!audit) return { answered: 0, total: 0, percentage: 0, mandatoryAnswered: 0, mandatoryTotal: 0 };

        let answered = 0;
        let total = 0;
        let mandatoryAnswered = 0;
        let mandatoryTotal = 0;

        audit.areas.forEach(area => {
            area.scopes.forEach(scope => {
                scope.questions.forEach(q => {
                    total++;
                    const hasResponse = localResponses[q.id]?.score !== null && localResponses[q.id]?.score !== undefined;
                    if (hasResponse) answered++;

                    if (q.isMandatory) {
                        mandatoryTotal++;
                        if (hasResponse) mandatoryAnswered++;
                    }
                });
            });
        });

        return {
            answered,
            total,
            percentage: total > 0 ? Math.round((answered / total) * 100) : 0,
            mandatoryAnswered,
            mandatoryTotal,
        };
    }, [audit, localResponses]);

    // Calculate area progress
    const getAreaProgress = useCallback((area: AuditArea) => {
        let answered = 0;
        let total = 0;

        area.scopes.forEach(scope => {
            scope.questions.forEach(q => {
                total++;
                if (localResponses[q.id]?.score !== null && localResponses[q.id]?.score !== undefined) {
                    answered++;
                }
            });
        });

        return { answered, total, percentage: total > 0 ? Math.round((answered / total) * 100) : 0 };
    }, [localResponses]);

    // Debounced save
    const handleResponseChange = useCallback((questionId: string, field: 'score' | 'comment' | 'recommendation', value: number | string | null) => {
        setLocalResponses(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                score: prev[questionId]?.score ?? null,
                comment: prev[questionId]?.comment ?? '',
                recommendation: prev[questionId]?.recommendation ?? '',
                [field]: value,
            },
        }));

        // Trigger autosave
        updateResponses([{ questionId, [field]: value }]);
    }, [updateResponses]);

    // Toggle question accordion
    const toggleQuestion = (questionId: string) => {
        setExpandedQuestions(prev => {
            const next = new Set(prev);
            if (next.has(questionId)) {
                next.delete(questionId);
            } else {
                next.add(questionId);
            }
            return next;
        });
    };

    // Add action item for a question
    const handleAddActionItem = (actionItem: Omit<QuestionActionItem, 'id'>) => {
        const newItem: QuestionActionItem = {
            ...actionItem,
            id: `qa-${Date.now()}`,
        };
        setQuestionActionItems(prev => [...prev, newItem]);
        setActionModal(null);
    };

    // Get action items for a question
    const getQuestionActions = (questionId: string) => {
        return questionActionItems.filter(a => a.questionId === questionId);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-slate-600">Loading audit...</p>
                </div>
            </div>
        );
    }

    if (error || !audit) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Audit</h2>
                    <p className="text-slate-600 mb-4">{error || 'Audit not found'}</p>
                    <button
                        onClick={() => navigate('/audits')}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                        Back to Audits
                    </button>
                </div>
            </div>
        );
    }

    const currentArea = audit.areas.find(a => a.id === activeAreaId) || audit.areas[0];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-8xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-lg font-semibold text-slate-900">
                                    {audit.projectName}
                                </h1>
                                <p className="text-sm text-slate-500">{audit.templateName}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <SaveIndicator status={saveStatus} />
                            <ProgressHeader
                                current={progress.answered}
                                total={progress.total}
                            />
                            <button
                                onClick={() => navigate(`/audits/${auditId}/report`)}
                                disabled={progress.mandatoryAnswered < progress.mandatoryTotal}
                                className={`
                                    px-5 py-2 font-medium rounded-lg transition-all
                                    ${progress.mandatoryAnswered >= progress.mandatoryTotal
                                        ? 'bg-primary text-white hover:bg-primary-dark'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }
                                `}
                            >
                                Complete Audit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex max-w-8xl mx-auto w-full">
                {/* Left Sidebar - Area Navigation */}
                <div className="w-72 bg-white border-r border-slate-200 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Audit Areas
                        </h2>
                        <nav className="space-y-1">
                            {audit.areas.map((area) => {
                                const areaProgress = getAreaProgress(area);
                                const isActive = area.id === activeAreaId;

                                return (
                                    <button
                                        key={area.id}
                                        onClick={() => setActiveAreaId(area.id)}
                                        className={`
                                            w-full text-left px-3 py-3 rounded-lg transition-all
                                            ${isActive
                                                ? 'bg-primary/10 border-l-4 border-primary'
                                                : 'hover:bg-slate-50 border-l-4 border-transparent'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-slate-700'}`}>
                                                {area.name}
                                            </span>
                                            <span className={`text-xs ${areaProgress.percentage === 100 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {areaProgress.percentage}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 rounded-full ${areaProgress.percentage === 100 ? 'bg-emerald-500' : 'bg-primary'
                                                    }`}
                                                style={{ width: `${areaProgress.percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-400 mt-1 block">
                                            {areaProgress.answered}/{areaProgress.total} questions
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Scoring Guidelines Legend */}
                    <div className="p-4 border-t border-slate-100">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                            <Info size={12} />
                            Scoring Guide
                        </h3>
                        <div className="space-y-1.5">
                            {SCORING_GUIDELINES.map(g => (
                                <div key={g.value} className="flex items-center gap-2 text-xs">
                                    <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold border ${g.color}`}>
                                        {g.value}
                                    </span>
                                    <span className="text-slate-600">{g.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content - Questions */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Area Header */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900">{currentArea.name}</h2>
                        {currentArea.description && (
                            <p className="text-slate-500 mt-1">{currentArea.description}</p>
                        )}
                    </div>

                    {/* Scopes and Questions */}
                    <div className="space-y-6">
                        {currentArea.scopes.map((scope) => (
                            <ScopeSection
                                key={scope.id}
                                scope={scope}
                                localResponses={localResponses}
                                expandedQuestions={expandedQuestions}
                                onToggleQuestion={toggleQuestion}
                                onResponseChange={handleResponseChange}
                                onAddAction={(qId, qText) => setActionModal({ open: true, questionId: qId, questionText: qText })}
                                getQuestionActions={getQuestionActions}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Item Modal */}
            {actionModal && (
                <AddActionModal
                    questionId={actionModal.questionId}
                    questionText={actionModal.questionText}
                    users={users || mockUsers}
                    onClose={() => setActionModal(null)}
                    onSubmit={handleAddActionItem}
                />
            )}
        </div>
    );
};

// Scope Section Component
interface ScopeSectionProps {
    scope: AuditScope;
    localResponses: Record<string, { score: number | null; comment: string; recommendation: string }>;
    expandedQuestions: Set<string>;
    onToggleQuestion: (id: string) => void;
    onResponseChange: (questionId: string, field: 'score' | 'comment' | 'recommendation', value: number | string | null) => void;
    onAddAction: (questionId: string, questionText: string) => void;
    getQuestionActions: (questionId: string) => QuestionActionItem[];
}

const ScopeSection: React.FC<ScopeSectionProps> = ({
    scope,
    localResponses,
    expandedQuestions,
    onToggleQuestion,
    onResponseChange,
    onAddAction,
    getQuestionActions,
}) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">{scope.name}</h3>
            </div>
            <div className="divide-y divide-slate-100">
                {scope.questions.map((question, index) => (
                    <QuestionAccordion
                        key={question.id}
                        question={question}
                        index={index + 1}
                        response={localResponses[question.id]}
                        isExpanded={expandedQuestions.has(question.id)}
                        onToggle={() => onToggleQuestion(question.id)}
                        onResponseChange={onResponseChange}
                        onAddAction={() => onAddAction(question.id, question.text)}
                        actionItems={getQuestionActions(question.id)}
                    />
                ))}
            </div>
        </div>
    );
};

// Question Accordion Component
interface QuestionAccordionProps {
    question: AuditQuestion;
    index: number;
    response?: { score: number | null; comment: string; recommendation: string };
    isExpanded: boolean;
    onToggle: () => void;
    onResponseChange: (questionId: string, field: 'score' | 'comment' | 'recommendation', value: number | string | null) => void;
    onAddAction: () => void;
    actionItems: QuestionActionItem[];
}

const QuestionAccordion: React.FC<QuestionAccordionProps> = ({
    question,
    index,
    response,
    isExpanded,
    onToggle,
    onResponseChange,
    onAddAction,
    actionItems,
}) => {
    const isAnswered = response?.score !== null && response?.score !== undefined;
    const selectedGuideline = SCORING_GUIDELINES.find(g => g.value === response?.score);

    return (
        <div className={`
            ${question.isMandatory && !isAnswered ? 'bg-red-50/30' : ''}
        `}>
            {/* Accordion Header */}
            <button
                onClick={onToggle}
                className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-slate-50/50 transition-colors"
            >
                {/* Question Number & Status */}
                <div className="flex-shrink-0 flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono w-6">Q{index}</span>
                    {isAnswered ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                        <div className={`w-4 h-4 rounded-full border-2 ${question.isMandatory ? 'border-red-400' : 'border-slate-300'
                            }`} />
                    )}
                </div>

                {/* Question Text */}
                <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-medium">
                        {question.text}
                        {question.isMandatory && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </p>
                    {!isExpanded && isAnswered && selectedGuideline && (
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded border ${selectedGuideline.color}`}>
                                {selectedGuideline.value} - {selectedGuideline.label}
                            </span>
                            {response?.comment && (
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <MessageSquare size={12} />
                                    Has comment
                                </span>
                            )}
                            {actionItems.length > 0 && (
                                <span className="text-xs text-amber-600 flex items-center gap-1">
                                    <ClipboardList size={12} />
                                    {actionItems.length} action(s)
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Expand/Collapse Icon */}
                <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Accordion Content */}
            {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 animate-fade-in">
                    {/* Scoring Guidelines */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                            <Info size={14} className="text-slate-400" />
                            Scoring Guidelines
                        </label>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            {SCORING_GUIDELINES.map(guideline => (
                                <button
                                    key={guideline.value}
                                    onClick={() => onResponseChange(question.id, 'score', guideline.value)}
                                    className={`
                                        p-3 rounded-lg border text-left transition-all
                                        ${response?.score === guideline.value
                                            ? `${guideline.color} border-2 shadow-sm`
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`
                                            w-6 h-6 rounded flex items-center justify-center text-sm font-bold
                                            ${response?.score === guideline.value ? '' : 'bg-slate-100 text-slate-600'}
                                        `}>
                                            {guideline.value}
                                        </span>
                                        <span className="font-medium text-sm">{guideline.label}</span>
                                        {response?.score === guideline.value && (
                                            <Check size={14} className="ml-auto text-emerald-600" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 ml-8">{guideline.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <MessageSquare size={14} className="text-slate-400" />
                            Comments / Observations
                        </label>
                        <textarea
                            value={response?.comment || ''}
                            onChange={(e) => onResponseChange(question.id, 'comment', e.target.value)}
                            placeholder="Add your observations and notes..."
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg resize-none
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Recommendation */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Lightbulb size={14} className="text-amber-500" />
                            Recommendations
                        </label>
                        <textarea
                            value={response?.recommendation || ''}
                            onChange={(e) => onResponseChange(question.id, 'recommendation', e.target.value)}
                            placeholder="Add improvement recommendations..."
                            rows={2}
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg resize-none
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Evidence Upload */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <Upload size={14} className="text-slate-400" />
                            Evidence
                        </label>
                        <div className="space-y-2">
                            {/* Existing files */}
                            {question.response?.evidences && question.response.evidences.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {question.response.evidences.map((file) => (
                                        <a
                                            key={file.id}
                                            href={file.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 hover:text-primary hover:bg-slate-100 transition-colors"
                                        >
                                            <Upload size={14} className="text-slate-400" />
                                            {file.fileName}
                                        </a>
                                    ))}
                                </div>
                            )}
                            {/* Upload button */}
                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-3 w-full border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-primary/50 hover:text-primary hover:bg-slate-50 transition-colors"
                            >
                                <Upload size={16} />
                                Click to upload evidence
                            </button>
                        </div>
                    </div>

                    {/* Action Items for this Question */}
                    <div className="border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <ClipboardList size={14} className="text-slate-400" />
                                Action Items
                                {actionItems.length > 0 && (
                                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                                        {actionItems.length}
                                    </span>
                                )}
                            </label>
                            <button
                                onClick={onAddAction}
                                className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
                            >
                                <Plus size={14} />
                                Add Action
                            </button>
                        </div>

                        {actionItems.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">No action items for this question</p>
                        ) : (
                            <div className="space-y-2">
                                {actionItems.map(action => (
                                    <div
                                        key={action.id}
                                        className="p-3 bg-slate-50 rounded-lg border border-slate-100"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h5 className="font-medium text-slate-800 text-sm">{action.title}</h5>
                                                <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                                            </div>
                                            <span className={`
                                                px-2 py-0.5 text-xs font-medium rounded
                                                ${action.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                                    action.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                                        action.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-slate-100 text-slate-600'}
                                            `}>
                                                {action.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                            <span>Owner: {action.owner.name}</span>
                                            <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Add Action Modal Component
interface AddActionModalProps {
    questionId: string;
    questionText: string;
    users: User[];
    onClose: () => void;
    onSubmit: (action: Omit<QuestionActionItem, 'id'>) => void;
}

const AddActionModal: React.FC<AddActionModalProps> = ({
    questionId,
    questionText,
    users,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ownerId: '',
        priority: 'Medium' as Priority,
        dueDate: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.ownerId) newErrors.ownerId = 'Owner is required';
        if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const owner = users.find(u => u.id === formData.ownerId);
        if (!owner) return;

        onSubmit({
            questionId,
            title: formData.title,
            description: formData.description,
            owner,
            priority: formData.priority,
            dueDate: formData.dueDate,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-scale-up max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Add Action Item</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Related Question */}
                <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Related Question:</p>
                    <p className="text-sm text-slate-700">{questionText}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Brief action item title"
                            className={`
                                w-full px-4 py-2.5 border rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                ${errors.title ? 'border-red-300' : 'border-slate-300'}
                            `}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detailed description of the action required"
                            rows={3}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg resize-none
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Owner */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Owner *
                        </label>
                        <select
                            value={formData.ownerId}
                            onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                            className={`
                                w-full px-4 py-2.5 border rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                ${errors.ownerId ? 'border-red-300' : 'border-slate-300'}
                            `}
                        >
                            <option value="">Select owner...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                        {errors.ownerId && (
                            <p className="mt-1 text-sm text-red-600">{errors.ownerId}</p>
                        )}
                    </div>

                    {/* Priority & Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Priority
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Due Date *
                            </label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className={`
                                    w-full px-4 py-2.5 border rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                    ${errors.dueDate ? 'border-red-300' : 'border-slate-300'}
                                `}
                            />
                            {errors.dueDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-slate-700 font-medium bg-slate-100 rounded-lg hover:bg-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg
                                bg-primary text-white hover:bg-primary-dark transition-all"
                        >
                            <Plus size={16} />
                            Add Action Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConductAudit;
