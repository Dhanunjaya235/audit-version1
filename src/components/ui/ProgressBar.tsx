import React from 'react';

interface ProgressBarProps {
    current: number;
    target: number;
    showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    current,
    target = 100,
    showLabel = true
}) => {
    const percentage = Math.min((current / target) * 100, 100);
    const isValid = Math.abs(current - target) < 0.01;

    const getColor = () => {
        if (isValid) return 'bg-green-500';
        if (percentage > 100) return 'bg-red-500';
        if (percentage > 75) return 'bg-yellow-500';
        return 'bg-primary';
    };

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        Total Weightage
                    </span>
                    <span className={`text-sm font-bold ${isValid ? 'text-green-600' : 'text-gray-900'}`}>
                        {current.toFixed(1)}% / {target}%
                    </span>
                </div>
            )}

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full ${getColor()} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {!isValid && (
                <p className="text-xs text-red-600 mt-1 animate-fade-in">
                    {current < target
                        ? `Need ${(target - current).toFixed(1)}% more to reach 100%`
                        : `Exceeded by ${(current - target).toFixed(1)}%`
                    }
                </p>
            )}
        </div>
    );
};
