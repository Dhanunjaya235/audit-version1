import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    Calendar,
    ClipboardCheck,
    Plus,
    ChevronRight,
    Users,
    FileText,
    Clock,
    AlertCircle,
    X,
    Loader2,
} from 'lucide-react';

// Mock data for projects
interface ProjectAudit {
    id: string;
    auditDate: string;
    status: 'Draft' | 'Scheduled' | 'In Progress' | 'Completed' | 'Closed';
    score: number | null;
    templateName: string;
}

interface ProjectDetail {
    id: string;
    name: string;
    code: string;
    description: string;
    status: 'Active' | 'On Hold' | 'Completed';
    client: string;
    startDate: string;
    endDate: string | null;
    teamSize: number;
    deliveryLead: string;
    templateId: string;
    templateName: string;
    lastAuditDate: string | null;
    lastAuditScore: number | null;
    audits: ProjectAudit[];
}

// Comprehensive mock project data
const mockProjectsData: ProjectDetail[] = [
    {
        id: 'proj-1',
        name: 'Phoenix Banking Platform',
        code: 'PHX-2024',
        description: 'Core banking modernization initiative - migrating legacy COBOL systems to microservices architecture',
        status: 'Active',
        client: 'First National Bank',
        startDate: '2024-03-01',
        endDate: null,
        teamSize: 24,
        deliveryLead: 'Sarah Chen',
        templateId: 'tmpl-1',
        templateName: 'Enterprise Software Audit',
        lastAuditDate: '2026-02-15',
        lastAuditScore: 72,
        audits: [
            { id: 'audit-1', auditDate: '2026-02-15', status: 'In Progress', score: 72, templateName: 'Enterprise Software Audit' },
            { id: 'audit-6', auditDate: '2026-01-15', status: 'Completed', score: 45, templateName: 'Security & Compliance Review' },
        ],
    },
    {
        id: 'proj-2',
        name: 'Atlas Healthcare System',
        code: 'ATL-2024',
        description: 'Patient management and EHR integration platform for multi-hospital network',
        status: 'Active',
        client: 'Metro Health Network',
        startDate: '2024-06-15',
        endDate: null,
        teamSize: 18,
        deliveryLead: 'Michael Rodriguez',
        templateId: 'tmpl-1',
        templateName: 'Enterprise Software Audit',
        lastAuditDate: '2026-02-10',
        lastAuditScore: 85,
        audits: [
            { id: 'audit-2', auditDate: '2026-02-10', status: 'Completed', score: 85, templateName: 'Enterprise Software Audit' },
            { id: 'audit-7', auditDate: '2026-02-08', status: 'In Progress', score: 58, templateName: 'Security & Compliance Review' },
        ],
    },
    {
        id: 'proj-3',
        name: 'Velocity E-Commerce',
        code: 'VEL-2025',
        description: 'Next-gen e-commerce platform with AI-powered recommendations and real-time inventory',
        status: 'Active',
        client: 'Retail Giants Inc.',
        startDate: '2025-01-10',
        endDate: null,
        teamSize: 15,
        deliveryLead: 'Emily Thompson',
        templateId: 'tmpl-2',
        templateName: 'Agile Delivery Assessment',
        lastAuditDate: null,
        lastAuditScore: null,
        audits: [
            { id: 'audit-3', auditDate: '2026-02-20', status: 'Scheduled', score: null, templateName: 'Agile Delivery Assessment' },
        ],
    },
    {
        id: 'proj-4',
        name: 'Horizon Analytics',
        code: 'HRZ-2024',
        description: 'Real-time data analytics dashboard with ML-powered insights for business intelligence',
        status: 'Completed',
        client: 'DataCorp Solutions',
        startDate: '2024-02-01',
        endDate: '2026-01-30',
        teamSize: 12,
        deliveryLead: 'David Kim',
        templateId: 'tmpl-2',
        templateName: 'Agile Delivery Assessment',
        lastAuditDate: '2026-01-28',
        lastAuditScore: 91,
        audits: [
            { id: 'audit-4', auditDate: '2026-01-28', status: 'Closed', score: 91, templateName: 'Agile Delivery Assessment' },
        ],
    },
    {
        id: 'proj-5',
        name: 'Nexus IoT Platform',
        code: 'NXS-2025',
        description: 'Industrial IoT device management and monitoring platform for manufacturing sector',
        status: 'Active',
        client: 'Industrial Dynamics',
        startDate: '2025-02-01',
        endDate: null,
        teamSize: 10,
        deliveryLead: 'James Wilson',
        templateId: 'tmpl-1',
        templateName: 'Enterprise Software Audit',
        lastAuditDate: null,
        lastAuditScore: null,
        audits: [
            { id: 'audit-5', auditDate: '2026-02-25', status: 'Draft', score: null, templateName: 'Enterprise Software Audit' },
        ],
    },
    {
        id: 'proj-6',
        name: 'CloudMigrate Pro',
        code: 'CMP-2024',
        description: 'Enterprise cloud migration toolkit with automated assessment and migration capabilities',
        status: 'On Hold',
        client: 'TechForward Inc.',
        startDate: '2024-08-01',
        endDate: null,
        teamSize: 8,
        deliveryLead: 'Amanda Foster',
        templateId: 'tmpl-3',
        templateName: 'Security & Compliance Review',
        lastAuditDate: null,
        lastAuditScore: null,
        audits: [],
    },
];

// Mock users for participants selection
const mockUsers = [
    { id: 'user-2', name: 'Michael Rodriguez', role: 'Auditor' },
    { id: 'user-3', name: 'Emily Thompson', role: 'Auditor' },
    { id: 'user-7', name: 'Amanda Foster', role: 'Practice Lead' },
    { id: 'user-8', name: 'James Wilson', role: 'Auditor' },
];

export const ProjectsPage: React.FC = () => {
    const navigate = useNavigate();
    const [projects] = useState<ProjectDetail[]>(mockProjectsData);
    const [loading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [scheduleModal, setScheduleModal] = useState<{ open: boolean; project: ProjectDetail | null }>({
        open: false,
        project: null,
    });

    const filteredProjects = statusFilter === 'All'
        ? projects
        : projects.filter(p => p.status === statusFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'On Hold': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Completed': return 'bg-purple-50 text-purple-700 border-purple-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-slate-400';
        if (score >= 70) return 'text-emerald-600';
        if (score >= 40) return 'text-amber-600';
        return 'text-red-600';
    };

    const getAuditStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Scheduled': return 'bg-purple-100 text-purple-700';
            case 'Draft': return 'bg-slate-100 text-slate-600';
            case 'Closed': return 'bg-slate-100 text-slate-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleScheduleAudit = (project: ProjectDetail) => {
        setScheduleModal({ open: true, project });
    };

    const handleViewAudit = (auditId: string, status: string) => {
        if (status === 'In Progress') {
            navigate(`/audits/${auditId}/execute`);
        } else if (status === 'Completed' || status === 'Closed') {
            navigate(`/audits/${auditId}/report`);
        } else {
            navigate(`/audits/${auditId}/preparation`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-8xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 w-48 bg-slate-200 rounded" />
                        <div className="h-4 w-64 bg-slate-200 rounded" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 h-64" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-8xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                            <p className="text-slate-500 mt-1">
                                Manage projects and schedule audits
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500">
                                {filteredProjects.length} projects
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-8xl mx-auto px-6 py-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500">Status:</span>
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        {['All', 'Active', 'On Hold', 'Completed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`
                                    px-4 py-1.5 text-sm font-medium rounded-md transition-all
                                    ${statusFilter === status
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }
                                `}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-8xl mx-auto px-6 py-4 pb-12">
                {filteredProjects.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
                        <p className="text-slate-500">No projects match the selected filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredProjects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onScheduleAudit={() => handleScheduleAudit(project)}
                                onViewAudit={handleViewAudit}
                                getStatusColor={getStatusColor}
                                getScoreColor={getScoreColor}
                                getAuditStatusColor={getAuditStatusColor}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Schedule Audit Modal */}
            {scheduleModal.open && scheduleModal.project && (
                <ScheduleAuditModal
                    project={scheduleModal.project}
                    onClose={() => setScheduleModal({ open: false, project: null })}
                    onSuccess={(auditId) => {
                        setScheduleModal({ open: false, project: null });
                        navigate(`/audits/${auditId}/preparation`);
                    }}
                />
            )}
        </div>
    );
};

// Project Card Component
interface ProjectCardProps {
    project: ProjectDetail;
    onScheduleAudit: () => void;
    onViewAudit: (auditId: string, status: string) => void;
    getStatusColor: (status: string) => string;
    getScoreColor: (score: number | null) => string;
    getAuditStatusColor: (status: string) => string;
    formatDate: (date: string | null) => string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    onScheduleAudit,
    onViewAudit,
    getStatusColor,
    getScoreColor,
    getAuditStatusColor,
    formatDate,
}) => {
    const hasActiveAudit = project.audits.some(a => a.status === 'In Progress' || a.status === 'Scheduled');

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                {project.code}
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
                                {project.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                            {project.name}
                        </h3>
                    </div>
                    {project.lastAuditScore !== null && (
                        <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(project.lastAuditScore)}`}>
                                {project.lastAuditScore}%
                            </div>
                            <div className="text-xs text-slate-400">Last Score</div>
                        </div>
                    )}
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {project.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <Building2 size={12} className="text-slate-400" />
                        {project.client}
                    </div>
                    <div className="flex items-center gap-1">
                        <Users size={12} className="text-slate-400" />
                        {project.teamSize} members
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {formatDate(project.startDate)}
                    </div>
                </div>
            </div>

            {/* Audit History */}
            <div className="px-6 py-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <ClipboardCheck size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Audits</span>
                        <span className="text-xs text-slate-400">({project.audits.length})</span>
                    </div>
                    <button
                        onClick={onScheduleAudit}
                        disabled={hasActiveAudit}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                            transition-all duration-200
                            ${hasActiveAudit
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary-dark hover:shadow-md'
                            }
                        `}
                    >
                        <Plus size={12} />
                        Schedule Audit
                    </button>
                </div>

                {project.audits.length === 0 ? (
                    <div className="text-center py-4">
                        <FileText size={24} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs text-slate-400">No audits yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {project.audits.slice(0, 3).map(audit => (
                            <div
                                key={audit.id}
                                onClick={() => onViewAudit(audit.id, audit.status)}
                                className="
                                    flex items-center justify-between p-3
                                    bg-white rounded-lg border border-slate-100
                                    hover:border-primary/30 hover:bg-primary/5
                                    cursor-pointer transition-all group/audit
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${getAuditStatusColor(audit.status)}`}>
                                        {audit.status}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {formatDate(audit.auditDate)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {audit.score !== null && (
                                        <span className={`text-sm font-semibold ${getScoreColor(audit.score)}`}>
                                            {audit.score}%
                                        </span>
                                    )}
                                    <ChevronRight
                                        size={14}
                                        className="text-slate-300 group-hover/audit:text-primary group-hover/audit:translate-x-0.5 transition-all"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer - Template info */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileText size={12} className="text-slate-400" />
                    Template: <span className="font-medium text-slate-700">{project.templateName}</span>
                </div>
                {project.lastAuditDate && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={12} />
                        Last: {formatDate(project.lastAuditDate)}
                    </div>
                )}
            </div>
        </div>
    );
};

// Schedule Audit Modal
interface ScheduleAuditModalProps {
    project: ProjectDetail;
    onClose: () => void;
    onSuccess: (auditId: string) => void;
}

const ScheduleAuditModal: React.FC<ScheduleAuditModalProps> = ({
    project,
    onClose,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        auditDate: '',
        participantIds: [] as string[],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.auditDate) {
            newErrors.auditDate = 'Audit date is required';
        }
        if (formData.participantIds.length === 0) {
            newErrors.participantIds = 'Select at least one participant';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newAuditId = `audit-new-${Date.now()}`;
        setLoading(false);
        onSuccess(newAuditId);
    };

    const toggleParticipant = (userId: string) => {
        setFormData(prev => ({
            ...prev,
            participantIds: prev.participantIds.includes(userId)
                ? prev.participantIds.filter(id => id !== userId)
                : [...prev.participantIds, userId],
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-scale-up">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Schedule Audit</h2>
                        <p className="text-sm text-slate-500 mt-1">{project.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Template (readonly) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Audit Template
                        </label>
                        <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                            {project.templateName}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            Template is pre-configured for this project
                        </p>
                    </div>

                    {/* Audit Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Audit Date *
                        </label>
                        <input
                            type="date"
                            value={formData.auditDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, auditDate: e.target.value })}
                            className={`
                                w-full px-4 py-2.5 border rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                ${errors.auditDate ? 'border-red-300' : 'border-slate-300'}
                            `}
                        />
                        {errors.auditDate && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle size={14} />
                                {errors.auditDate}
                            </p>
                        )}
                    </div>

                    {/* Participants */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Participants *
                        </label>
                        <div className="space-y-2">
                            {mockUsers.map(user => (
                                <label
                                    key={user.id}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                                        transition-all duration-150
                                        ${formData.participantIds.includes(user.id)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }
                                    `}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.participantIds.includes(user.id)}
                                        onChange={() => toggleParticipant(user.id)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-slate-900">{user.name}</div>
                                        <div className="text-xs text-slate-500">{user.role}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.participantIds && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle size={14} />
                                {errors.participantIds}
                            </p>
                        )}
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
                            disabled={loading}
                            className="
                                flex items-center gap-2 px-5 py-2.5 font-medium rounded-lg
                                bg-primary text-white
                                hover:bg-primary-dark transition-all
                                disabled:opacity-50
                            "
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <ClipboardCheck size={16} />
                                    Schedule Audit
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectsPage;
