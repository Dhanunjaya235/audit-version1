import React from 'react';

interface ScoreSelectorProps {
    value: number | null;
    onChange: (value: number) => void;
    disabled?: boolean;
    maxScore?: number;
}

const scoreLabels: Record<number, string> = {
    0: 'NA',
    1: 'Poor',
    2: 'Below',
    3: 'Fair',
    4: 'Good',
    5: 'Excellent',
};

const scoreColors: Record<number, { selected: string; default: string }> = {
    0: {
        selected: 'bg-slate-500 text-white border-slate-500',
        default: 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50',
    },
    1: {
        selected: 'bg-red-500 text-white border-red-500',
        default: 'bg-white text-red-600 border-slate-300 hover:border-red-400 hover:bg-red-50',
    },
    2: {
        selected: 'bg-orange-500 text-white border-orange-500',
        default: 'bg-white text-orange-600 border-slate-300 hover:border-orange-400 hover:bg-orange-50',
    },
    3: {
        selected: 'bg-amber-500 text-white border-amber-500',
        default: 'bg-white text-amber-600 border-slate-300 hover:border-amber-400 hover:bg-amber-50',
    },
    4: {
        selected: 'bg-emerald-500 text-white border-emerald-500',
        default: 'bg-white text-emerald-600 border-slate-300 hover:border-emerald-400 hover:bg-emerald-50',
    },
    5: {
        selected: 'bg-teal-500 text-white border-teal-500',
        default: 'bg-white text-teal-600 border-slate-300 hover:border-teal-400 hover:bg-teal-50',
    },
};

export const ScoreSelector: React.FC<ScoreSelectorProps> = ({
    value,
    onChange,
    disabled = false,
    maxScore = 5,
}) => {
    const scores = Array.from({ length: maxScore + 1 }, (_, i) => i);

    return (
        <div className="flex flex-wrap gap-1.5">
            {scores.map((score) => {
                const isSelected = value === score;
                const colors = scoreColors[score];

                return (
                    <button
                        key={score}
                        type="button"
                        onClick={() => !disabled && onChange(score)}
                        disabled={disabled}
                        className={`
                            flex flex-col items-center justify-center
                            min-w-[52px] py-2 px-2
                            text-xs font-medium
                            border rounded-lg
                            transition-all duration-150
                            ${isSelected ? colors.selected : colors.default}
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            ${isSelected ? 'shadow-sm ring-2 ring-offset-1 ring-opacity-30' : ''}
                            ${isSelected && score === 5 ? 'ring-teal-300' : ''}
                            ${isSelected && score === 4 ? 'ring-emerald-300' : ''}
                            ${isSelected && score === 3 ? 'ring-amber-300' : ''}
                            ${isSelected && score === 2 ? 'ring-orange-300' : ''}
                            ${isSelected && score === 1 ? 'ring-red-300' : ''}
                            ${isSelected && score === 0 ? 'ring-slate-300' : ''}
                        `}
                    >
                        <span className="text-base font-bold">{score}</span>
                        <span className="text-[10px] opacity-80">{scoreLabels[score]}</span>
                    </button>
                );
            })}
        </div>
    );
};
