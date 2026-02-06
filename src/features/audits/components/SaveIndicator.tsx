import React from 'react';
import { Check, Loader2, AlertCircle, Cloud } from 'lucide-react';
import type { SaveStatus } from '../types';

interface SaveIndicatorProps {
    status: SaveStatus;
    className?: string;
}

const statusConfig: Record<SaveStatus, { icon: React.ElementType; text: string; color: string }> = {
    idle: {
        icon: Cloud,
        text: '',
        color: 'text-slate-400',
    },
    saving: {
        icon: Loader2,
        text: 'Saving...',
        color: 'text-blue-500',
    },
    saved: {
        icon: Check,
        text: 'Saved',
        color: 'text-emerald-500',
    },
    error: {
        icon: AlertCircle,
        text: 'Error saving',
        color: 'text-red-500',
    },
};

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({ status, className = '' }) => {
    if (status === 'idle') return null;

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <div
            className={`
                inline-flex items-center gap-1.5 text-sm font-medium
                ${config.color} ${className}
                animate-fade-in
            `}
        >
            <Icon
                size={16}
                className={status === 'saving' ? 'animate-spin' : ''}
            />
            <span>{config.text}</span>
        </div>
    );
};
