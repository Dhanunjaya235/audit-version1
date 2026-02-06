import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAudit, useUpdateResponses, useUploadEvidence } from '../api';
import {
    StatusBadge,
    ScoreSelector,
    SaveIndicator,
    ProgressHeader,
    EvidenceUpload,
    QuestionSkeleton,
} from '../components';
import { debounce, canConductAudit } from '../utils';
import type { AuditArea, AuditScope, AuditQuestion, UpdateResponseRequest } from '../types';

export const ConductAudit: React.FC = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const navigate = useNavigate();

    const { data: audit, loading, error, refetch } = useAudit(auditId || '');
    const { updateResponses, saveStatus, error: saveError } = useUpdateResponses(auditId || '');
    const { uploadEvidence } = useUploadEvidence();

    const [activeAreaId, setActiveAreaId] = useState<string>('');
    const [localResponses, setLocalResponses] = useState<Map<string, UpdateResponseRequest>>(new Map());

    // Set first area as active when audit loads
    useEffect(() => {
        if (audit?.areas.length && !activeAreaId) {
            setActiveAreaId(audit.areas[0].id);
        }
    }, [audit, activeAreaId]);

    // Debounced save function
    const debouncedSave = useRef(
        debounce((updates: UpdateResponseRequest[]) => {
            if (updates.length > 0) {
                updateResponses(updates);
            }
        }, 800)
    ).current;

    // Handle response change
    const handleResponseChange = useCallback((questionId: string, field: keyof UpdateResponseRequest, value: unknown) => {
        setLocalResponses((prev) => {
            const updated = new Map(prev);
            const existing = updated.get(questionId) || { questionId };
            updated.set(questionId, { ...existing, [field]: value });

            // Trigger debounced save
            const updates = Array.from(updated.values());
            debouncedSave(updates);

            return updated;
        });
    }, [debouncedSave]);

    // Handle evidence upload
    const handleEvidenceUpload = useCallback(async (questionId: string, file: File) => {
        if (!auditId) return;
        await uploadEvidence(auditId, questionId, file);
        refetch();
    }, [auditId, uploadEvidence, refetch]);

    // Calculate progress
    const { answeredCount, totalCount, unansweredMandatory } = useMemo(() => {
        if (!audit) return { answeredCount: 0, totalCount: 0, unansweredMandatory: [] };

        let answered = 0;
        let total = 0;
        const unanswered: { areaName: string; questionText: string }[] = [];

        audit.areas.forEach((area) => {
            area.scopes.forEach((scope) => {
                scope.questions.forEach((question) => {
                    total++;
                    const localResponse = localResponses.get(question.id);
                    const hasScore = localResponse?.score !== undefined && localResponse?.score !== null
                        ? true
                        : question.response?.isAnswered;

                    if (hasScore) {
                        answered++;
                    } else if (question.isMandatory) {
                        unanswered.push({ areaName: area.name, questionText: question.text });
                    }
                });
            });
        });

        return { answeredCount: answered, totalCount: total, unansweredMandatory: unanswered };
    }, [audit, localResponses]);

    const canComplete = unansweredMandatory.length === 0 && answeredCount === totalCount;

    const activeArea = audit?.areas.find((a) => a.id === activeAreaId);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="flex">
                    {/* Skeleton sidebar */}
                    <div className="w-64 bg-white border-r border-slate-200 min-h-screen p-4">
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    </div>
                    {/* Skeleton content */}
                    <div className="flex-1 p-6 space-y-4">
                        <QuestionSkeleton />
                        <QuestionSkeleton />
                        <QuestionSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !audit) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <p className="text-red-600">{error || 'Audit not found'}</p>
                    <button onClick={() => navigate('/audits')} className="mt-4 text-primary hover:underline">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sticky Left Navigation */}
            <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
                <div className="p-4">
                    <button
                        onClick={() => navigate('/audits')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Audit Areas
                    </h2>

                    <nav className="space-y-1">
                        {audit.areas.map((area) => {
                            const areaAnswered = area.scopes.reduce((sum, scope) =>
                                sum + scope.questions.filter((q) => {
                                    const local = localResponses.get(q.id);
                                    return (local?.score !== undefined && local?.score !== null) || q.response?.isAnswered;
                                }).length, 0
                            );
                            const areaTotal = area.scopes.reduce((sum, scope) => sum + scope.questions.length, 0);
                            const isComplete = areaAnswered === areaTotal;

                            return (
                                <button
                                    key={area.id}
                                    onClick={() => setActiveAreaId(area.id)}
                                    className={`
                                        w-full text-left px-3 py-3 rounded-lg
                                        transition-all duration-150
                                        ${activeAreaId === area.id
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-slate-700 hover:bg-slate-100'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm truncate pr-2">{area.name}</span>
                                        {isComplete ? (
                                            <CheckCircle2
                                                size={16}
                                                className={activeAreaId === area.id ? 'text-white' : 'text-emerald-500'}
                                            />
                                        ) : (
                                            <span className={`text-xs ${activeAreaId === area.id ? 'text-white/80' : 'text-slate-400'}`}>
                                                {areaAnswered}/{areaTotal}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-slate-900">{audit.projectName}</h1>
                            <StatusBadge status={audit.status} />
                        </div>
                        <SaveIndicator status={saveStatus} />
                    </div>

                    <ProgressHeader current={answeredCount} total={totalCount} label="Completion" />

                    {/* Unanswered mandatory warning */}
                    {unansweredMandatory.length > 0 && (
                        <div className="mt-4 flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <span className="font-medium">{unansweredMandatory.length} mandatory questions</span> remaining.
                                Complete all mandatory questions to finalize the audit.
                            </div>
                        </div>
                    )}

                    {saveError && (
                        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
                            <AlertCircle size={18} />
                            {saveError}
                        </div>
                    )}
                </div>

                {/* Questions Content */}
                <div className="px-6 py-6">
                    {activeArea && (
                        <AreaContent
                            area={activeArea}
                            localResponses={localResponses}
                            onResponseChange={handleResponseChange}
                            onEvidenceUpload={handleEvidenceUpload}
                            canEdit={canConductAudit()}
                        />
                    )}

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                        <button
                            onClick={() => {
                                const currentIndex = audit.areas.findIndex((a) => a.id === activeAreaId);
                                if (currentIndex > 0) {
                                    setActiveAreaId(audit.areas[currentIndex - 1].id);
                                }
                            }}
                            disabled={audit.areas[0]?.id === activeAreaId}
                            className="
                                px-5 py-2.5 text-slate-700 font-medium
                                bg-white border border-slate-300 rounded-lg
                                hover:bg-slate-50 transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            Previous Area
                        </button>

                        {audit.areas[audit.areas.length - 1]?.id === activeAreaId ? (
                            <button
                                onClick={() => navigate(`/audits/${auditId}/report`)}
                                disabled={!canComplete}
                                className="
                                    px-6 py-2.5 font-medium rounded-lg
                                    bg-primary text-white
                                    hover:bg-primary-dark transition-all duration-200
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    hover:shadow-lg
                                "
                            >
                                View Report
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    const currentIndex = audit.areas.findIndex((a) => a.id === activeAreaId);
                                    if (currentIndex < audit.areas.length - 1) {
                                        setActiveAreaId(audit.areas[currentIndex + 1].id);
                                    }
                                }}
                                className="
                                    px-5 py-2.5 font-medium rounded-lg
                                    bg-primary text-white
                                    hover:bg-primary-dark transition-all duration-200
                                    hover:shadow-lg
                                "
                            >
                                Next Area
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// Area Content Component
interface AreaContentProps {
    area: AuditArea;
    localResponses: Map<string, UpdateResponseRequest>;
    onResponseChange: (questionId: string, field: keyof UpdateResponseRequest, value: unknown) => void;
    onEvidenceUpload: (questionId: string, file: File) => Promise<void>;
    canEdit: boolean;
}

const AreaContent: React.FC<AreaContentProps> = ({
    area,
    localResponses,
    onResponseChange,
    onEvidenceUpload,
    canEdit,
}) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{area.name}</h2>
                {area.description && (
                    <p className="text-slate-500">{area.description}</p>
                )}
            </div>

            {area.scopes.map((scope) => (
                <ScopeSection
                    key={scope.id}
                    scope={scope}
                    localResponses={localResponses}
                    onResponseChange={onResponseChange}
                    onEvidenceUpload={onEvidenceUpload}
                    canEdit={canEdit}
                />
            ))}
        </div>
    );
};

// Scope Section Component
interface ScopeSectionProps {
    scope: AuditScope;
    localResponses: Map<string, UpdateResponseRequest>;
    onResponseChange: (questionId: string, field: keyof UpdateResponseRequest, value: unknown) => void;
    onEvidenceUpload: (questionId: string, file: File) => Promise<void>;
    canEdit: boolean;
}

const ScopeSection: React.FC<ScopeSectionProps> = ({
    scope,
    localResponses,
    onResponseChange,
    onEvidenceUpload,
    canEdit,
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                {scope.name}
            </h3>

            <div className="space-y-4 pl-4">
                {scope.questions.map((question, index) => (
                    <QuestionCard
                        key={question.id}
                        question={question}
                        index={index}
                        localResponse={localResponses.get(question.id)}
                        onResponseChange={onResponseChange}
                        onEvidenceUpload={onEvidenceUpload}
                        canEdit={canEdit}
                    />
                ))}
            </div>
        </div>
    );
};

// Question Card Component
interface QuestionCardProps {
    question: AuditQuestion;
    index: number;
    localResponse?: UpdateResponseRequest;
    onResponseChange: (questionId: string, field: keyof UpdateResponseRequest, value: unknown) => void;
    onEvidenceUpload: (questionId: string, file: File) => Promise<void>;
    canEdit: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    index,
    localResponse,
    onResponseChange,
    onEvidenceUpload,
    canEdit,
}) => {
    const currentScore = localResponse?.score ?? question.response?.score ?? null;
    const currentComment = localResponse?.comment ?? question.response?.comment ?? '';
    const currentRecommendation = localResponse?.recommendation ?? question.response?.recommendation ?? '';

    const isAnswered = currentScore !== null && currentScore !== undefined;
    const showWarning = question.isMandatory && !isAnswered;

    return (
        <div
            className={`
                bg-white rounded-xl border p-6
                transition-all duration-200
                ${showWarning
                    ? 'border-amber-300 ring-2 ring-amber-100'
                    : 'border-slate-200 hover:border-slate-300'
                }
            `}
        >
            {/* Question header */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                    <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-slate-400 mt-0.5">Q{index + 1}</span>
                        <div>
                            <p className="text-slate-800 font-medium">{question.text}</p>
                            {question.isMandatory && (
                                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 rounded">
                                    Mandatory
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {isAnswered && (
                    <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                )}
            </div>

            {/* Score selector */}
            <div className="mb-5">
                <label className="block text-sm font-medium text-slate-600 mb-2">Score</label>
                <ScoreSelector
                    value={currentScore}
                    onChange={(value) => onResponseChange(question.id, 'score', value)}
                    disabled={!canEdit}
                />
            </div>

            {/* Comment */}
            <div className="mb-5">
                <label className="block text-sm font-medium text-slate-600 mb-2">Comment</label>
                <textarea
                    value={currentComment}
                    onChange={(e) => onResponseChange(question.id, 'comment', e.target.value)}
                    disabled={!canEdit}
                    placeholder="Add your observations..."
                    rows={3}
                    className="
                        w-full px-4 py-3 text-sm
                        bg-slate-50 border border-slate-200 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                        disabled:opacity-60 disabled:cursor-not-allowed
                        resize-none
                        placeholder:text-slate-400
                    "
                />
            </div>

            {/* Evidence */}
            <div className="mb-5">
                <label className="block text-sm font-medium text-slate-600 mb-2">Evidence</label>
                <EvidenceUpload
                    questionId={question.id}
                    onUpload={(file) => onEvidenceUpload(question.id, file)}
                    existingFiles={question.response?.evidences?.map((e) => ({
                        id: e.id,
                        fileName: e.fileName,
                        fileUrl: e.fileUrl,
                    }))}
                    disabled={!canEdit}
                />
            </div>

            {/* Recommendation */}
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Recommendation</label>
                <textarea
                    value={currentRecommendation}
                    onChange={(e) => onResponseChange(question.id, 'recommendation', e.target.value)}
                    disabled={!canEdit}
                    placeholder="Suggest improvements..."
                    rows={2}
                    className="
                        w-full px-4 py-3 text-sm
                        bg-slate-50 border border-slate-200 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                        disabled:opacity-60 disabled:cursor-not-allowed
                        resize-none
                        placeholder:text-slate-400
                    "
                />
            </div>
        </div>
    );
};

export default ConductAudit;
