import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { FileQuestion, ClipboardList, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const AuditEmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon = FileQuestion,
    title,
    description,
    action,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Icon className="text-slate-400" size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 mb-8 max-w-md leading-relaxed">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="
                        px-6 py-2.5 rounded-lg font-medium
                        bg-primary text-white
                        hover:bg-primary-dark
                        transition-all duration-200
                        hover:shadow-lg hover:scale-105
                        active:scale-100
                    "
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export const NoAuditsState: React.FC<{ onCreateClick?: () => void }> = ({ onCreateClick }) => (
    <AuditEmptyState
        icon={ClipboardList}
        title="No audits found"
        description="There are no audits matching your current filters. Try adjusting your filters or create a new audit."
        action={onCreateClick ? { label: 'Create Audit', onClick: onCreateClick } : undefined}
    />
);

export const NoActionsState: React.FC = () => (
    <AuditEmptyState
        icon={CheckCircle2}
        title="All caught up!"
        description="There are no action items assigned to you at the moment. Action items will appear here when they're created."
    />
);
