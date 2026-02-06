import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, ListTodo } from 'lucide-react';
import { useMyActions } from '../api';
import { PriorityBadge, Skeleton, NoActionsState } from '../components';

export const MyActions: React.FC = () => {
    const navigate = useNavigate();
    const { data: actions, loading, error } = useMyActions();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isOverdue = (dueDate: string, status: string) => {
        if (status === 'Resolved' || status === 'Closed') return false;
        return new Date(dueDate) < new Date();
    };

    // Group actions by status
    const groupedActions = React.useMemo(() => {
        if (!actions) return { open: [], inProgress: [], other: [] };

        return {
            open: actions.filter((a) => a.status === 'Open'),
            inProgress: actions.filter((a) => a.status === 'In Progress'),
            other: actions.filter((a) => a.status === 'Resolved' || a.status === 'Closed'),
        };
    }, [actions]);

    const statusColors = {
        Open: 'bg-slate-100 text-slate-700',
        'In Progress': 'bg-blue-50 text-blue-700',
        Resolved: 'bg-emerald-50 text-emerald-700',
        Closed: 'bg-purple-50 text-purple-700',
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-8xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ListTodo size={20} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">My Actions</h1>
                            <p className="text-slate-500">Action items assigned to you across all audits</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-8xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                                <Skeleton className="h-5 w-64 mb-3" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <div className="flex gap-4 mt-4">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : !actions || actions.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200">
                        <NoActionsState />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Open Actions */}
                        {groupedActions.open.length > 0 && (
                            <ActionSection
                                title="Open"
                                count={groupedActions.open.length}
                                actions={groupedActions.open}
                                formatDate={formatDate}
                                isOverdue={isOverdue}
                                statusColors={statusColors}
                                onNavigate={(auditId) => navigate(`/audits/${auditId}/actions`)}
                            />
                        )}

                        {/* In Progress Actions */}
                        {groupedActions.inProgress.length > 0 && (
                            <ActionSection
                                title="In Progress"
                                count={groupedActions.inProgress.length}
                                actions={groupedActions.inProgress}
                                formatDate={formatDate}
                                isOverdue={isOverdue}
                                statusColors={statusColors}
                                onNavigate={(auditId) => navigate(`/audits/${auditId}/actions`)}
                            />
                        )}

                        {/* Completed Actions */}
                        {groupedActions.other.length > 0 && (
                            <ActionSection
                                title="Completed"
                                count={groupedActions.other.length}
                                actions={groupedActions.other}
                                formatDate={formatDate}
                                isOverdue={isOverdue}
                                statusColors={statusColors}
                                onNavigate={(auditId) => navigate(`/audits/${auditId}/actions`)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Action Section Component
interface ActionSectionProps {
    title: string;
    count: number;
    actions: {
        id: string;
        auditId: string;
        title: string;
        description: string;
        priority: 'Low' | 'Medium' | 'High' | 'Critical';
        status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
        dueDate: string;
    }[];
    formatDate: (date: string) => string;
    isOverdue: (dueDate: string, status: string) => boolean;
    statusColors: Record<string, string>;
    onNavigate: (auditId: string) => void;
}

const ActionSection: React.FC<ActionSectionProps> = ({
    title,
    count,
    actions,
    formatDate,
    isOverdue,
    statusColors,
    onNavigate,
}) => {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                    {count}
                </span>
            </div>

            <div className="space-y-3">
                {actions.map((action) => {
                    const overdue = isOverdue(action.dueDate, action.status);

                    return (
                        <div
                            key={action.id}
                            onClick={() => onNavigate(action.auditId)}
                            className={`
                                bg-white rounded-xl border p-5 cursor-pointer
                                transition-all duration-200 group
                                ${overdue ? 'border-red-200' : 'border-slate-200 hover:border-slate-300'}
                                hover:shadow-md
                            `}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                                            {action.title}
                                        </h3>
                                        <PriorityBadge priority={action.priority} size="sm" />
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[action.status]}`}>
                                            {action.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm line-clamp-2 mb-3">{action.description}</p>

                                    <div className={`flex items-center gap-2 text-sm ${overdue ? 'text-red-600' : 'text-slate-500'}`}>
                                        <Calendar size={14} className={overdue ? 'text-red-500' : 'text-slate-400'} />
                                        Due: {formatDate(action.dueDate)}
                                        {overdue && <span className="text-xs font-medium">(Overdue)</span>}
                                    </div>
                                </div>

                                <ArrowRight
                                    size={20}
                                    className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyActions;
