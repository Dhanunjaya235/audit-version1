import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Calendar, Users, ChevronRight } from 'lucide-react';
import { useAudits, useProjects } from '../api';
import {
    StatusBadge,
    ScoreBadge,
    FilterBar,
    DashboardSkeleton,
    NoAuditsState,
} from '../components';
import type { AuditFilters, AuditListItem } from '../types';
import { canCreateAudit } from '../utils';

export const AuditDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState<AuditFilters>(() => {
        // Initialize filters from URL query params
        const projectId = searchParams.get('project');
        return projectId ? { projectId } : {};
    });

    // Update URL when filters change
    useEffect(() => {
        const newParams = new URLSearchParams();
        if (filters.projectId) {
            newParams.set('project', filters.projectId);
        }
        setSearchParams(newParams, { replace: true });
    }, [filters.projectId, setSearchParams]);

    const { data: audits, loading: auditsLoading, error: auditsError } = useAudits(filters);
    const { data: projects, loading: projectsLoading } = useProjects();

    const handleRowClick = (audit: AuditListItem) => {
        // Navigate based on status
        if (audit.status === 'In Progress') {
            navigate(`/audits/${audit.id}/execute`);
        } else if (audit.status === 'Completed' || audit.status === 'Closed') {
            navigate(`/audits/${audit.id}/report`);
        } else {
            navigate(`/audits/${audit.id}/preparation`);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-8xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Audits</h1>
                            <p className="text-slate-500 mt-1">
                                Manage and track your audit assessments
                            </p>
                        </div>
                        {canCreateAudit() && (
                            <button
                                onClick={() => navigate('/audits/new')}
                                className="
                                    flex items-center gap-2 px-5 py-2.5
                                    bg-primary text-white font-medium rounded-lg
                                    hover:bg-primary-dark transition-all duration-200
                                    hover:shadow-lg hover:scale-105 active:scale-100
                                "
                            >
                                <Plus size={18} />
                                New Audit
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-8xl mx-auto px-6 py-6">
                {/* Filter Bar */}
                <FilterBar
                    filters={filters}
                    onFiltersChange={setFilters}
                    projects={projects || []}
                    loading={projectsLoading}
                />

                {/* Content */}
                <div className="mt-6">
                    {auditsLoading ? (
                        <DashboardSkeleton />
                    ) : auditsError ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <p className="text-red-600">{auditsError}</p>
                        </div>
                    ) : !audits || audits.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200">
                            <NoAuditsState
                                onCreateClick={canCreateAudit() ? () => navigate('/audits/new') : undefined}
                            />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {audits.map((audit) => (
                                <AuditCard
                                    key={audit.id}
                                    audit={audit}
                                    onClick={() => handleRowClick(audit)}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Audit Card Component
interface AuditCardProps {
    audit: AuditListItem;
    onClick: () => void;
    formatDate: (date: string) => string;
}

const AuditCard: React.FC<AuditCardProps> = ({ audit, onClick, formatDate }) => {
    return (
        <div
            onClick={onClick}
            className="
                bg-white rounded-xl border border-slate-200
                p-5 cursor-pointer
                transition-all duration-200
                hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5
                group
            "
        >
            <div className="flex items-start justify-between gap-4">
                {/* Left side - Main info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-primary transition-colors">
                            {audit.projectName}
                        </h3>
                        <StatusBadge status={audit.status} />
                    </div>

                    <p className="text-sm text-slate-500 mb-4">
                        {audit.templateName}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            {formatDate(audit.auditDate)}
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={14} className="text-slate-400" />
                            {audit.participants.length} participants
                        </div>
                    </div>
                </div>

                {/* Right side - Score and arrow */}
                <div className="flex items-center gap-4">
                    <ScoreBadge score={audit.score} size="lg" />
                    <ChevronRight
                        size={20}
                        className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};

export default AuditDashboard;
