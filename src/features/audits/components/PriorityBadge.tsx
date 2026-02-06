import React from 'react';
import type { Priority } from '../types';

interface PriorityBadgeProps {
    priority: Priority;
    size?: 'sm' | 'md';
}

const priorityConfig: Record<Priority, { bg: string; text: string; icon: string }> = {
    Low: {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        icon: '○',
    },
    Medium: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: '◐',
    },
    High: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        icon: '●',
    },
    Critical: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: '◉',
    },
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
    const config = priorityConfig[priority];

    return (
        <span
            className={`
                inline-flex items-center gap-1 font-medium rounded-md
                ${config.bg} ${config.text} ${sizeClasses[size]}
            `}
        >
            <span className="text-xs">{config.icon}</span>
            {priority}
        </span>
    );
};
