import React from 'react';
import type { AuditStatus } from '../types';

interface StatusBadgeProps {
    status: AuditStatus;
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<AuditStatus, { bg: string; text: string; dot: string }> = {
    Draft: {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        dot: 'bg-slate-400',
    },
    Scheduled: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        dot: 'bg-blue-500',
    },
    'In Progress': {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
    },
    Completed: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
    },
    Closed: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        dot: 'bg-purple-500',
    },
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
    const config = statusConfig[status];

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 font-medium rounded-full
                ${config.bg} ${config.text} ${sizeClasses[size]}
            `}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {status}
        </span>
    );
};
