import React, { useState, useEffect, useRef } from 'react';
import { Search, Check, X, ChevronDown } from 'lucide-react';
import type { User } from '../types';

interface MultiUserSelectProps {
    users: User[];
    selectedIds: string[];
    onChange: (selectedIds: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
}

export const MultiUserSelect: React.FC<MultiUserSelectProps> = ({
    users,
    selectedIds,
    onChange,
    placeholder = 'Select participants',
    disabled = false,
    error,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedUsers = users.filter((u) => selectedIds.includes(u.id));
    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleUser = (userId: string) => {
        if (selectedIds.includes(userId)) {
            onChange(selectedIds.filter((id) => id !== userId));
        } else {
            onChange([...selectedIds, userId]);
        }
    };

    const removeUser = (userId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selectedIds.filter((id) => id !== userId));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            {/* Selected users display / trigger */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    min-h-[44px] px-3 py-2
                    bg-white border rounded-lg
                    flex flex-wrap items-center gap-2
                    cursor-pointer
                    transition-all duration-150
                    ${error ? 'border-red-300 focus-within:ring-red-200' : 'border-slate-300'}
                    ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}
                    ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'hover:border-slate-400'}
                `}
            >
                {selectedUsers.length === 0 ? (
                    <span className="text-slate-400 text-sm">{placeholder}</span>
                ) : (
                    selectedUsers.map((user) => (
                        <span
                            key={user.id}
                            className="
                                inline-flex items-center gap-1.5
                                px-2 py-1 rounded-md
                                bg-primary/10 text-primary text-sm
                            "
                        >
                            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                            {user.name}
                            {!disabled && (
                                <button
                                    onClick={(e) => removeUser(user.id, e)}
                                    className="p-0.5 hover:bg-primary/20 rounded"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </span>
                    ))
                )}
                <ChevronDown
                    size={18}
                    className={`ml-auto text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden animate-fade-in">
                    {/* Search */}
                    <div className="p-2 border-b border-slate-100">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users..."
                                className="
                                    w-full pl-9 pr-3 py-2
                                    text-sm bg-slate-50 border border-slate-200 rounded-md
                                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                "
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* User list */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                            <div className="px-4 py-6 text-sm text-slate-500 text-center">
                                No users found
                            </div>
                        ) : (
                            filteredUsers.map((user) => {
                                const isSelected = selectedIds.includes(user.id);
                                return (
                                    <div
                                        key={user.id}
                                        onClick={() => toggleUser(user.id)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3
                                            cursor-pointer transition-colors
                                            ${isSelected ? 'bg-primary/5' : 'hover:bg-slate-50'}
                                        `}
                                    >
                                        <div
                                            className={`
                                                w-8 h-8 rounded-full flex items-center justify-center
                                                text-sm font-medium
                                                ${isSelected ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}
                                            `}
                                        >
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-slate-900 truncate">{user.name}</div>
                                            <div className="text-xs text-slate-500 truncate">{user.email}</div>
                                        </div>
                                        {isSelected && (
                                            <Check size={18} className="text-primary flex-shrink-0" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
