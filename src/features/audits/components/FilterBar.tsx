import React from 'react';
import { Filter, X } from 'lucide-react';
import type { AuditStatus, AuditFilters, Project } from '../types';

interface FilterBarProps {
    filters: AuditFilters;
    onFiltersChange: (filters: AuditFilters) => void;
    projects: Project[];
    loading?: boolean;
}

const statusOptions: AuditStatus[] = ['Draft', 'Scheduled', 'In Progress', 'Completed', 'Closed'];

export const FilterBar: React.FC<FilterBarProps> = ({
    filters,
    onFiltersChange,
    projects,
    loading = false,
}) => {
    const hasActiveFilters = filters.projectId || filters.status || filters.myAuditsOnly;

    const clearFilters = () => {
        onFiltersChange({});
    };

    return (
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-slate-200 py-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-slate-500">
                    <Filter size={16} />
                    <span className="text-sm font-medium">Filters</span>
                </div>

                {/* Project filter */}
                <select
                    value={filters.projectId || ''}
                    onChange={(e) => onFiltersChange({ ...filters, projectId: e.target.value || undefined })}
                    disabled={loading}
                    className="
                        px-3 py-2 text-sm
                        bg-white border border-slate-300 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                        disabled:opacity-50 disabled:cursor-not-allowed
                        appearance-none cursor-pointer
                    "
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem',
                    }}
                >
                    <option value="">All Projects</option>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>

                {/* Status filter - Segmented control */}
                <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => onFiltersChange({ ...filters, status: undefined })}
                        className={`
                            px-3 py-1.5 text-sm font-medium rounded-md
                            transition-all duration-150
                            ${!filters.status
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }
                        `}
                    >
                        All
                    </button>
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            onClick={() => onFiltersChange({ ...filters, status })}
                            className={`
                                px-3 py-1.5 text-sm font-medium rounded-md
                                transition-all duration-150
                                ${filters.status === status
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                                }
                            `}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* My Audits toggle */}
                <button
                    onClick={() => onFiltersChange({ ...filters, myAuditsOnly: !filters.myAuditsOnly })}
                    className={`
                        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                        border transition-all duration-150
                        ${filters.myAuditsOnly
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }
                    `}
                >
                    <div
                        className={`
                            w-4 h-4 rounded border-2 flex items-center justify-center
                            transition-colors
                            ${filters.myAuditsOnly
                                ? 'bg-white border-white'
                                : 'border-slate-400'
                            }
                        `}
                    >
                        {filters.myAuditsOnly && (
                            <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 12 12">
                                <path d="M10.28 2.28L4.25 8.31 1.72 5.78a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.5-6.5a.75.75 0 10-1.06-1.06z" />
                            </svg>
                        )}
                    </div>
                    My Audits
                </button>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="
                            flex items-center gap-1.5 px-3 py-2 text-sm
                            text-slate-500 hover:text-slate-700
                            transition-colors
                        "
                    >
                        <X size={14} />
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
};
