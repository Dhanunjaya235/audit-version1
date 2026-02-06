import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
    <div
        className={`
            animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200
            bg-[length:200%_100%] rounded-md
            ${className}
        `}
    />
);

export const CardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-start justify-between">
            <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
    </div>
);

export const TableRowSkeleton: React.FC = () => (
    <div className="flex items-center gap-4 p-4 border-b border-slate-100">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16" />
        <div className="flex-1" />
        <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
);

export const QuestionSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-14 w-14 rounded-lg" />
            ))}
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
    </div>
);

export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <CardSkeleton key={i} />
        ))}
    </div>
);
