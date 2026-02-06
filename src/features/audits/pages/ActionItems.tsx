import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Plus,
    Calendar,
    User,
    X,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { useAuditActions, useCreateAction, useUpdateAction, useUsers } from '../api';
import { PriorityBadge, Skeleton, AuditEmptyState } from '../components';
import { canCreateActions } from '../utils';
import type { ActionItem, ActionStatus, Priority, CreateActionRequest, ActionFilters } from '../types';

const statusOptions: ActionStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
const priorityOptions: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

export const ActionItems: React.FC = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const navigate = useNavigate();

    const [filters, setFilters] = useState<ActionFilters>({});
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data: actions, loading, error, refetch } = useAuditActions(auditId || '', filters);
    const { data: users } = useUsers();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const isOverdue = (dueDate: string, status: ActionStatus) => {
        if (status === 'Resolved' || status === 'Closed') return false;
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-8xl mx-auto px-6 py-6">
                    <button
                        onClick={() => navigate(`/audits/${auditId}/report`)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Report
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Action Items</h1>
                            <p className="text-slate-500 mt-1">
                                Track and manage follow-up actions from this audit
                            </p>
                        </div>

                        {canCreateActions() && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="
                                    flex items-center gap-2 px-5 py-2.5
                                    bg-primary text-white font-medium rounded-lg
                                    hover:bg-primary-dark transition-all duration-200
                                    hover:shadow-lg
                                "
                            >
                                <Plus size={18} />
                                Add Action
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-8xl mx-auto px-6 py-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500">Filter by:</span>

                    {/* Status filter */}
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setFilters({ ...filters, status: undefined })}
                            className={`
                                px-3 py-1.5 text-sm font-medium rounded-md transition-all
                                ${!filters.status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}
                            `}
                        >
                            All
                        </button>
                        {statusOptions.map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilters({ ...filters, status })}
                                className={`
                                    px-3 py-1.5 text-sm font-medium rounded-md transition-all
                                    ${filters.status === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}
                                `}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Priority filter */}
                    <select
                        value={filters.priority || ''}
                        onChange={(e) => setFilters({ ...filters, priority: (e.target.value as Priority) || undefined })}
                        className="
                            px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                        "
                    >
                        <option value="">All Priorities</option>
                        {priorityOptions.map((priority) => (
                            <option key={priority} value={priority}>{priority}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-8xl mx-auto px-6 py-4 pb-12">
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                                <Skeleton className="h-6 w-64 mb-3" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <div className="flex gap-4 mt-4">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-24" />
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
                        <AuditEmptyState
                            title="No action items"
                            description="There are no action items for this audit yet. Create action items to track follow-up tasks."
                            action={canCreateActions() ? { label: 'Add Action', onClick: () => setShowCreateModal(true) } : undefined}
                        />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {actions.map((action) => (
                            <ActionCard
                                key={action.id}
                                action={action}
                                formatDate={formatDate}
                                isOverdue={isOverdue(action.dueDate, action.status)}
                                auditId={auditId || ''}
                                onUpdate={refetch}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <CreateActionModal
                    auditId={auditId || ''}
                    users={users || []}
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        setShowCreateModal(false);
                        refetch();
                    }}
                />
            )}
        </div>
    );
};

// Action Card Component
interface ActionCardProps {
    action: ActionItem;
    formatDate: (date: string) => string;
    isOverdue: boolean;
    auditId: string;
    onUpdate: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
    action,
    formatDate,
    isOverdue,
    auditId,
    onUpdate,
}) => {
    const { updateAction, loading: updating } = useUpdateAction(auditId);

    const handleStatusChange = async (newStatus: ActionStatus) => {
        await updateAction(action.id, { status: newStatus });
        onUpdate();
    };

    const statusColors: Record<ActionStatus, string> = {
        Open: 'bg-slate-100 text-slate-700',
        'In Progress': 'bg-blue-50 text-blue-700',
        Resolved: 'bg-emerald-50 text-emerald-700',
        Closed: 'bg-purple-50 text-purple-700',
    };

    return (
        <div
            className={`
                bg-white rounded-xl border p-5 transition-all duration-200
                ${isOverdue ? 'border-red-200 bg-red-50/30' : 'border-slate-200 hover:border-slate-300'}
            `}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{action.title}</h3>
                        <PriorityBadge priority={action.priority} size="sm" />
                    </div>
                    <p className="text-slate-600 text-sm mb-4">{action.description}</p>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-slate-400" />
                            {action.owner.name}
                        </div>
                        <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600' : ''}`}>
                            <Calendar size={14} className={isOverdue ? 'text-red-500' : 'text-slate-400'} />
                            {formatDate(action.dueDate)}
                            {isOverdue && <span className="text-xs font-medium">(Overdue)</span>}
                        </div>
                    </div>
                </div>

                {/* Status selector */}
                <div className="flex-shrink-0">
                    <select
                        value={action.status}
                        onChange={(e) => handleStatusChange(e.target.value as ActionStatus)}
                        disabled={updating}
                        className={`
                            px-3 py-2 text-sm font-medium rounded-lg border-0
                            focus:outline-none focus:ring-2 focus:ring-primary/20
                            ${statusColors[action.status]}
                            ${updating ? 'opacity-50' : ''}
                        `}
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

// Create Action Modal Component
interface CreateActionModalProps {
    auditId: string;
    users: { id: string; name: string; email: string }[];
    onClose: () => void;
    onCreated: () => void;
}

const CreateActionModal: React.FC<CreateActionModalProps> = ({
    auditId,
    users,
    onClose,
    onCreated,
}) => {
    const { createAction, loading, error } = useCreateAction(auditId);

    const [formData, setFormData] = useState<CreateActionRequest>({
        title: '',
        description: '',
        ownerId: '',
        priority: 'Medium',
        dueDate: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.ownerId) errors.ownerId = 'Owner is required';
        if (!formData.dueDate) errors.dueDate = 'Due date is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const result = await createAction(formData);
        if (result) {
            onCreated();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-scale-up">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900">Create Action Item</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={`
                                w-full px-4 py-2.5 border rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                ${formErrors.title ? 'border-red-300' : 'border-slate-300'}
                            `}
                            placeholder="Enter action title"
                        />
                        {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className={`
                                w-full px-4 py-2.5 border rounded-lg resize-none
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                ${formErrors.description ? 'border-red-300' : 'border-slate-300'}
                            `}
                            placeholder="Describe the action..."
                        />
                        {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                    </div>

                    {/* Owner */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Owner *</label>
                        <select
                            value={formData.ownerId}
                            onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                            className={`
                                w-full px-4 py-2.5 border rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                ${formErrors.ownerId ? 'border-red-300' : 'border-slate-300'}
                            `}
                        >
                            <option value="">Select owner</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                        {formErrors.ownerId && <p className="mt-1 text-sm text-red-600">{formErrors.ownerId}</p>}
                    </div>

                    {/* Priority & Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                                className="
                                    w-full px-4 py-2.5 border border-slate-300 rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                "
                            >
                                {priorityOptions.map((priority) => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date *</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className={`
                                    w-full px-4 py-2.5 border rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                    ${formErrors.dueDate ? 'border-red-300' : 'border-slate-300'}
                                `}
                            />
                            {formErrors.dueDate && <p className="mt-1 text-sm text-red-600">{formErrors.dueDate}</p>}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
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
                                hover:bg-primary-dark transition-colors
                                disabled:opacity-50
                            "
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Action'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActionItems;
