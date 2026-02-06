import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    FileText,
    TrendingUp,
    ExternalLink,
    CheckCircle2,
    Loader2,
    AlertTriangle,
} from 'lucide-react';
import { useAuditReport, useFinalizeAudit } from '../api';
import { RAGBadge, getRAGStatus, Skeleton } from '../components';
import type { AuditReport } from '../types';
import { canFinalizeAudit } from '../utils';

export const AuditReportView: React.FC = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const navigate = useNavigate();

    const { data: report, loading, error, refetch } = useAuditReport(auditId || '');
    const { finalizeAudit, loading: finalizing, error: finalizeError } = useFinalizeAudit();

    const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

    const handleFinalize = async () => {
        if (!auditId) return;
        const success = await finalizeAudit(auditId);
        if (success) {
            refetch();
            setShowFinalizeConfirm(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
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
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <Skeleton className="h-32 rounded-xl" />
                        <Skeleton className="h-32 rounded-xl" />
                        <Skeleton className="h-32 rounded-xl" />
                    </div>
                    <Skeleton className="h-64 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <p className="text-red-600">{error || 'Report not found'}</p>
                    <button onClick={() => navigate('/audits')} className="mt-4 text-primary hover:underline">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const ragStatus = getRAGStatus(report.overallScore);

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
                                <h1 className="text-2xl font-bold text-slate-900">Audit Report</h1>
                                {report.isFinalized && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
                                        <CheckCircle2 size={14} />
                                        Finalized
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-500">
                                {report.projectName} • {formatDate(report.auditDate)}
                            </p>
                        </div>

                        {canFinalizeAudit() && !report.isFinalized && (
                            <button
                                onClick={() => setShowFinalizeConfirm(true)}
                                className="
                                    px-5 py-2.5 font-medium rounded-lg
                                    bg-emerald-600 text-white
                                    hover:bg-emerald-700 transition-all duration-200
                                    hover:shadow-lg
                                "
                            >
                                Finalize Audit
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Finalize Confirmation Modal */}
            {showFinalizeConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowFinalizeConfirm(false)}
                    />
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-up">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle size={24} className="text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">Finalize Audit?</h3>
                                <p className="text-slate-500">
                                    Once finalized, the audit cannot be modified. This action is permanent.
                                </p>
                            </div>
                        </div>

                        {finalizeError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {finalizeError}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowFinalizeConfirm(false)}
                                className="px-4 py-2 text-slate-700 font-medium bg-slate-100 rounded-lg hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalize}
                                disabled={finalizing}
                                className="
                                    flex items-center gap-2 px-4 py-2 font-medium rounded-lg
                                    bg-emerald-600 text-white
                                    hover:bg-emerald-700 transition-colors
                                    disabled:opacity-50
                                "
                            >
                                {finalizing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Finalizing...
                                    </>
                                ) : (
                                    'Yes, Finalize'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Overall Score */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-500">Overall Score</span>
                            <TrendingUp size={20} className="text-slate-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-3">
                            {report.overallScore}%
                        </div>
                        <RAGBadge status={ragStatus} showScore={false} size="md" />
                    </div>

                    {/* Areas Covered */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-500">Areas Assessed</span>
                            <FileText size={20} className="text-slate-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-3">
                            {report.areaScores.length}
                        </div>
                        <span className="text-slate-500 text-sm">audit areas completed</span>
                    </div>

                    {/* Evidence Count */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-500">Evidence Collected</span>
                            <ExternalLink size={20} className="text-slate-400" />
                        </div>
                        <div className="text-4xl font-bold text-slate-900 mb-3">
                            {report.evidences.length}
                        </div>
                        <span className="text-slate-500 text-sm">files attached</span>
                    </div>
                </div>

                {/* Area-wise Scores */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Area-wise Performance</h2>
                    <div className="space-y-4">
                        {report.areaScores.map((area) => (
                            <AreaScoreBar key={area.areaId} area={area} />
                        ))}
                    </div>
                </div>

                {/* Findings */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Findings by Area</h2>
                    <div className="space-y-6">
                        {report.findings.map((finding) => (
                            <FindingsSection key={finding.areaId} finding={finding} />
                        ))}
                    </div>
                </div>

                {/* Evidence Preview */}
                {report.evidences.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6">Evidence Attachments</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {report.evidences.map((evidence) => (
                                <a
                                    key={evidence.id}
                                    href={evidence.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        flex items-center gap-3 p-4
                                        bg-slate-50 border border-slate-200 rounded-lg
                                        hover:border-primary hover:bg-primary/5
                                        transition-colors group
                                    "
                                >
                                    <FileText size={20} className="text-slate-400 group-hover:text-primary" />
                                    <span className="text-sm text-slate-700 truncate group-hover:text-primary">
                                        {evidence.fileName}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions link */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate(`/audits/${auditId}/actions`)}
                        className="
                            inline-flex items-center gap-2
                            text-primary hover:text-primary-dark
                            font-medium transition-colors
                        "
                    >
                        View Action Items
                        <ArrowLeft size={16} className="rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Area Score Bar Component
interface AreaScoreBarProps {
    area: AuditReport['areaScores'][0];
}

const AreaScoreBar: React.FC<AreaScoreBarProps> = ({ area }) => {
    const getBarColor = (percentage: number) => {
        if (percentage >= 70) return 'from-emerald-500 to-emerald-600';
        if (percentage >= 40) return 'from-amber-500 to-amber-600';
        return 'from-red-500 to-red-600';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-700">{area.areaName}</span>
                <span className="text-sm font-semibold text-slate-900">{area.percentage}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${getBarColor(area.percentage)} transition-all duration-500`}
                    style={{ width: `${area.percentage}%` }}
                />
            </div>
        </div>
    );
};

// Findings Section Component
interface FindingsSectionProps {
    finding: AuditReport['findings'][0];
}

const FindingsSection: React.FC<FindingsSectionProps> = ({ finding }) => {
    if (finding.items.length === 0) return null;

    return (
        <div>
            <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {finding.areaName}
            </h3>
            <div className="space-y-3 pl-4">
                {finding.items.map((item, index) => (
                    <div
                        key={index}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-100"
                    >
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <p className="text-slate-700 text-sm">{item.question}</p>
                            <span
                                className={`
                                    px-2 py-0.5 text-xs font-medium rounded
                                    ${item.score >= 4
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : item.score >= 2
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-red-100 text-red-700'
                                    }
                                `}
                            >
                                Score: {item.score}
                            </span>
                        </div>
                        {item.comment && (
                            <p className="text-sm text-slate-500 mb-2">
                                <span className="font-medium">Comment:</span> {item.comment}
                            </p>
                        )}
                        {item.recommendation && (
                            <p className="text-sm text-primary">
                                <span className="font-medium">Recommendation:</span> {item.recommendation}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuditReportView;
