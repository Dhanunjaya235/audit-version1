import React, { useState } from 'react';
import { Plus, Layers } from 'lucide-react';
import type { AuditArea } from '@/types/audit.types';
import { useAppDispatch } from '@/store/hooks';
import { addScope, deleteScope } from '@/store/slices/templatesSlice';
import { ScopeAccordion } from './ScopeAccordion';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface ScopesPanelProps {
    auditArea: AuditArea;
    templateId: string;
}

export const ScopesPanel: React.FC<ScopesPanelProps> = ({ auditArea, templateId }) => {
    const dispatch = useAppDispatch();
    const [scopeToDelete, setScopeToDelete] = useState<string | null>(null);
    const [newScopeName, setNewScopeName] = useState('');
    const [showAddScope, setShowAddScope] = useState(false);

    const handleAddScope = () => {
        if (newScopeName.trim()) {
            dispatch(addScope({
                templateId,
                areaId: auditArea.id,
                name: newScopeName.trim(),
            }));
            setNewScopeName('');
            setShowAddScope(false);
        }
    };

    const handleDeleteScope = () => {
        if (scopeToDelete) {
            dispatch(deleteScope({
                templateId,
                areaId: auditArea.id,
                scopeId: scopeToDelete,
            }));
            setScopeToDelete(null);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{auditArea.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {auditArea.scopes.length} scopes • {auditArea.weightage.toFixed(1)}% weightage
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setShowAddScope(true)}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Scope
                </Button>
            </div>

            {/* Add Scope Input */}
            {showAddScope && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg animate-slide-in">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Scope Name
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newScopeName}
                            onChange={(e) => setNewScopeName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddScope()}
                            placeholder="Enter scope name..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            autoFocus
                        />
                        <Button variant="primary" onClick={handleAddScope} disabled={!newScopeName.trim()}>
                            Add
                        </Button>
                        <Button variant="secondary" onClick={() => {
                            setShowAddScope(false);
                            setNewScopeName('');
                        }}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Scopes List */}
            <div className="flex-1 overflow-y-auto">
                {auditArea.scopes.length === 0 ? (
                    <EmptyState
                        icon={Layers}
                        title="No Scopes Yet"
                        description="Add scopes to organize questions within this audit area"
                        action={{
                            label: 'Add First Scope',
                            onClick: () => setShowAddScope(true),
                        }}
                    />
                ) : (
                    <div className="space-y-3">
                        {auditArea.scopes.map(scope => (
                            <ScopeAccordion
                                key={scope.id}
                                scope={scope}
                                templateId={templateId}
                                areaId={auditArea.id}
                                onDelete={() => setScopeToDelete(scope.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={scopeToDelete !== null}
                onClose={() => setScopeToDelete(null)}
                onConfirm={handleDeleteScope}
                title="Delete Scope"
                message="Are you sure you want to delete this scope and all its questions?"
                confirmText="Delete"
            />
        </div>
    );
};
