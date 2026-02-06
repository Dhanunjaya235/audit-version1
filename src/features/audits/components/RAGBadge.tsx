import React from 'react';
import type { RAGStatus } from '../types';

interface RAGBadgeProps {
    status: RAGStatus;
    score?: number;
    showScore?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const ragConfig: Record<RAGStatus, { bg: string; text: string; border: string; label: string }> = {
    Red: {
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        text: 'text-white',
        border: 'border-red-400',
        label: 'Needs Improvement',
    },
    Amber: {
        bg: 'bg-gradient-to-r from-amber-400 to-amber-500',
        text: 'text-amber-900',
        border: 'border-amber-300',
        label: 'Moderate',
    },
    Green: {
        bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
        text: 'text-white',
        border: 'border-emerald-400',
        label: 'Good',
    },
};

const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
};

export const RAGBadge: React.FC<RAGBadgeProps> = ({
    status,
    score,
    showScore = true,
    size = 'md',
}) => {
    const config = ragConfig[status];

    return (
        <div
            className={`
                inline-flex items-center gap-2 font-semibold rounded-lg shadow-sm
                ${config.bg} ${config.text} ${sizeClasses[size]}
            `}
        >
            {showScore && score !== undefined && (
                <span className="font-bold">{score}%</span>
            )}
            <span className="opacity-90">{config.label}</span>
        </div>
    );
};

/**
 * Get RAG status based on score percentage
 */
export const getRAGStatus = (score: number): RAGStatus => {
    if (score >= 70) return 'Green';
    if (score >= 40) return 'Amber';
    return 'Red';
};
