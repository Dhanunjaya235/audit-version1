import React from 'react';

interface ProgressHeaderProps {
    current: number;
    total: number;
    label?: string;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
    current,
    total,
    label = 'Progress',
}) => {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    const getProgressColor = () => {
        if (percentage >= 100) return 'from-emerald-500 to-emerald-600';
        if (percentage >= 75) return 'from-blue-500 to-blue-600';
        if (percentage >= 50) return 'from-amber-500 to-amber-600';
        return 'from-slate-400 to-slate-500';
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-600">{label}</span>
                    <span className="text-sm font-semibold text-slate-900">
                        {current} / {total} questions
                    </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`
                            h-full bg-gradient-to-r ${getProgressColor()}
                            transition-all duration-500 ease-out
                        `}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
            <div
                className={`
                    flex items-center justify-center
                    w-14 h-14 rounded-xl
                    bg-gradient-to-br ${getProgressColor()}
                    text-white font-bold text-lg
                    shadow-lg
                `}
            >
                {percentage}%
            </div>
        </div>
    );
};
