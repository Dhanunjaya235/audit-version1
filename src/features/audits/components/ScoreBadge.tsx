import React from 'react';

interface ScoreBadgeProps {
    score: number | null | undefined;
    maxScore?: number;
    size?: 'sm' | 'md' | 'lg';
}

const getScoreColor = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
    if (percentage >= 60) return 'bg-blue-100 text-blue-800 ring-blue-200';
    if (percentage >= 40) return 'bg-amber-100 text-amber-800 ring-amber-200';
    return 'bg-red-100 text-red-800 ring-red-200';
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs min-w-[36px]',
    md: 'px-2.5 py-1 text-sm min-w-[44px]',
    lg: 'px-3 py-1.5 text-base min-w-[52px]',
};

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
    score,
    maxScore = 100,
    size = 'md',
}) => {
    if (score === null || score === undefined) {
        return (
            <span
                className={`
                    inline-flex items-center justify-center font-medium rounded-md
                    bg-slate-100 text-slate-500 ring-1 ring-slate-200
                    ${sizeClasses[size]}
                `}
            >
                —
            </span>
        );
    }

    const colorClasses = getScoreColor(score, maxScore);

    return (
        <span
            className={`
                inline-flex items-center justify-center font-semibold rounded-md ring-1
                ${colorClasses} ${sizeClasses[size]}
            `}
        >
            {score}%
        </span>
    );
};
